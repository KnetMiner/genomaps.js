import './chart.css';function HE(A, e) {
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
var Dh = { exports: {} }, Wm = {}, Hr = {}, Ri = {}, Ls = {}, ve = {}, ys = {};
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
      return (H = this._str) !== null && H !== void 0 ? H : this._str = this._items.reduce((D, E) => `${D}${E}`, "");
    }
    get names() {
      var H;
      return (H = this._names) !== null && H !== void 0 ? H : this._names = this._items.reduce((D, E) => (E instanceof t && (D[E.str] = (D[E.str] || 0) + 1), D), {});
    }
  }
  A._Code = n, A.nil = new n("");
  function i(U, ...H) {
    const D = [U[0]];
    let E = 0;
    for (; E < H.length; )
      f(D, H[E]), D.push(U[++E]);
    return new n(D);
  }
  A._ = i;
  const s = new n("+");
  function l(U, ...H) {
    const D = [v(U[0])];
    let E = 0;
    for (; E < H.length; )
      D.push(s), f(D, H[E]), D.push(s, v(U[++E]));
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
    optimizeNames(S, R) {
      return this;
    }
  }
  class l extends s {
    constructor(S, R, aA) {
      super(), this.varKind = S, this.name = R, this.rhs = aA;
    }
    render({ es5: S, _n: R }) {
      const aA = S ? t.varKinds.var : this.varKind, bA = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${aA} ${this.name}${bA};` + R;
    }
    optimizeNames(S, R) {
      if (S[this.name.str])
        return this.rhs && (this.rhs = q(this.rhs, S, R)), this;
    }
    get names() {
      return this.rhs instanceof e._CodeOrName ? this.rhs.names : {};
    }
  }
  class f extends s {
    constructor(S, R, aA) {
      super(), this.lhs = S, this.rhs = R, this.sideEffects = aA;
    }
    render({ _n: S }) {
      return `${this.lhs} = ${this.rhs};` + S;
    }
    optimizeNames(S, R) {
      if (!(this.lhs instanceof e.Name && !S[this.lhs.str] && !this.sideEffects))
        return this.rhs = q(this.rhs, S, R), this;
    }
    get names() {
      const S = this.lhs instanceof e.Name ? {} : { ...this.lhs.names };
      return EA(S, this.rhs);
    }
  }
  class c extends f {
    constructor(S, R, aA, bA) {
      super(S, aA, bA), this.op = R;
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
    optimizeNames(S, R) {
      return this.code = q(this.code, S, R), this;
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
      return this.nodes.reduce((R, aA) => R + aA.render(S), "");
    }
    optimizeNodes() {
      const { nodes: S } = this;
      let R = S.length;
      for (; R--; ) {
        const aA = S[R].optimizeNodes();
        Array.isArray(aA) ? S.splice(R, 1, ...aA) : aA ? S[R] = aA : S.splice(R, 1);
      }
      return S.length > 0 ? this : void 0;
    }
    optimizeNames(S, R) {
      const { nodes: aA } = this;
      let bA = aA.length;
      for (; bA--; ) {
        const _A = aA[bA];
        _A.optimizeNames(S, R) || (CA(S, _A.names), aA.splice(bA, 1));
      }
      return aA.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((S, R) => OA(S, R.names), {});
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
    constructor(S, R) {
      super(R), this.condition = S;
    }
    render(S) {
      let R = `if(${this.condition})` + super.render(S);
      return this.else && (R += "else " + this.else.render(S)), R;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const S = this.condition;
      if (S === !0)
        return this.nodes;
      let R = this.else;
      if (R) {
        const aA = R.optimizeNodes();
        R = this.else = Array.isArray(aA) ? new F(aA) : aA;
      }
      if (R)
        return S === !1 ? R instanceof U ? R : R.nodes : this.nodes.length ? this : new U(iA(S), R instanceof U ? [R] : R.nodes);
      if (!(S === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(S, R) {
      var aA;
      if (this.else = (aA = this.else) === null || aA === void 0 ? void 0 : aA.optimizeNames(S, R), !!(super.optimizeNames(S, R) || this.else))
        return this.condition = q(this.condition, S, R), this;
    }
    get names() {
      const S = super.names;
      return EA(S, this.condition), this.else && OA(S, this.else.names), S;
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
    optimizeNames(S, R) {
      if (super.optimizeNames(S, R))
        return this.iteration = q(this.iteration, S, R), this;
    }
    get names() {
      return OA(super.names, this.iteration.names);
    }
  }
  class E extends H {
    constructor(S, R, aA, bA) {
      super(), this.varKind = S, this.name = R, this.from = aA, this.to = bA;
    }
    render(S) {
      const R = S.es5 ? t.varKinds.var : this.varKind, { name: aA, from: bA, to: _A } = this;
      return `for(${R} ${aA}=${bA}; ${aA}<${_A}; ${aA}++)` + super.render(S);
    }
    get names() {
      const S = EA(super.names, this.from);
      return EA(S, this.to);
    }
  }
  class M extends H {
    constructor(S, R, aA, bA) {
      super(), this.loop = S, this.varKind = R, this.name = aA, this.iterable = bA;
    }
    render(S) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(S);
    }
    optimizeNames(S, R) {
      if (super.optimizeNames(S, R))
        return this.iterable = q(this.iterable, S, R), this;
    }
    get names() {
      return OA(super.names, this.iterable.names);
    }
  }
  class K extends o {
    constructor(S, R, aA) {
      super(), this.name = S, this.args = R, this.async = aA;
    }
    render(S) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(S);
    }
  }
  K.kind = "func";
  class J extends v {
    render(S) {
      return "return " + super.render(S);
    }
  }
  J.kind = "return";
  class hA extends o {
    render(S) {
      let R = "try" + super.render(S);
      return this.catch && (R += this.catch.render(S)), this.finally && (R += this.finally.render(S)), R;
    }
    optimizeNodes() {
      var S, R;
      return super.optimizeNodes(), (S = this.catch) === null || S === void 0 || S.optimizeNodes(), (R = this.finally) === null || R === void 0 || R.optimizeNodes(), this;
    }
    optimizeNames(S, R) {
      var aA, bA;
      return super.optimizeNames(S, R), (aA = this.catch) === null || aA === void 0 || aA.optimizeNames(S, R), (bA = this.finally) === null || bA === void 0 || bA.optimizeNames(S, R), this;
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
    constructor(S, R = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...R, _n: R.lines ? `
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
    scopeValue(S, R) {
      const aA = this._extScope.value(S, R);
      return (this._values[aA.prefix] || (this._values[aA.prefix] = /* @__PURE__ */ new Set())).add(aA), aA;
    }
    getScopeValue(S, R) {
      return this._extScope.getValue(S, R);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(S) {
      return this._extScope.scopeRefs(S, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(S, R, aA, bA) {
      const _A = this._scope.toName(R);
      return aA !== void 0 && bA && (this._constants[_A.str] = aA), this._leafNode(new l(S, _A, aA)), _A;
    }
    // `const` declaration (`var` in es5 mode)
    const(S, R, aA) {
      return this._def(t.varKinds.const, S, R, aA);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(S, R, aA) {
      return this._def(t.varKinds.let, S, R, aA);
    }
    // `var` declaration with optional assignment
    var(S, R, aA) {
      return this._def(t.varKinds.var, S, R, aA);
    }
    // assignment code
    assign(S, R, aA) {
      return this._leafNode(new f(S, R, aA));
    }
    // `+=` code
    add(S, R) {
      return this._leafNode(new c(S, A.operators.ADD, R));
    }
    // appends passed SafeExpr to code or executes Block
    code(S) {
      return typeof S == "function" ? S() : S !== e.nil && this._leafNode(new p(S)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...S) {
      const R = ["{"];
      for (const [aA, bA] of S)
        R.length > 1 && R.push(","), R.push(aA), (aA !== bA || this.opts.es5) && (R.push(":"), (0, e.addCodeArg)(R, bA));
      return R.push("}"), new e._Code(R);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(S, R, aA) {
      if (this._blockNode(new U(S)), R && aA)
        this.code(R).else().code(aA).endIf();
      else if (R)
        this.code(R).endIf();
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
    _for(S, R) {
      return this._blockNode(S), R && this.code(R).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(S, R) {
      return this._for(new D(S), R);
    }
    // `for` statement for a range of values
    forRange(S, R, aA, bA, _A = this.opts.es5 ? t.varKinds.var : t.varKinds.let) {
      const zA = this._scope.toName(S);
      return this._for(new E(_A, zA, R, aA), () => bA(zA));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(S, R, aA, bA = t.varKinds.const) {
      const _A = this._scope.toName(S);
      if (this.opts.es5) {
        const zA = R instanceof e.Name ? R : this.var("_arr", R);
        return this.forRange("_i", 0, (0, e._)`${zA}.length`, (JA) => {
          this.var(_A, (0, e._)`${zA}[${JA}]`), aA(_A);
        });
      }
      return this._for(new M("of", bA, _A, R), () => aA(_A));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(S, R, aA, bA = this.opts.es5 ? t.varKinds.var : t.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(S, (0, e._)`Object.keys(${R})`, aA);
      const _A = this._scope.toName(S);
      return this._for(new M("in", bA, _A, R), () => aA(_A));
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
      const R = new J();
      if (this._blockNode(R), this.code(S), R.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(J);
    }
    // `try` statement
    try(S, R, aA) {
      if (!R && !aA)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const bA = new hA();
      if (this._blockNode(bA), this.code(S), R) {
        const _A = this.name("e");
        this._currNode = bA.catch = new cA(_A), R(_A);
      }
      return aA && (this._currNode = bA.finally = new wA(), this.code(aA)), this._endBlockNode(cA, wA);
    }
    // `throw` statement
    throw(S) {
      return this._leafNode(new B(S));
    }
    // start self-balancing block
    block(S, R) {
      return this._blockStarts.push(this._nodes.length), S && this.code(S).endBlock(R), this;
    }
    // end the current self-balancing block
    endBlock(S) {
      const R = this._blockStarts.pop();
      if (R === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const aA = this._nodes.length - R;
      if (aA < 0 || S !== void 0 && aA !== S)
        throw new Error(`CodeGen: wrong number of nodes: ${aA} vs ${S} expected`);
      return this._nodes.length = R, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(S, R = e.nil, aA, bA) {
      return this._blockNode(new K(S, R, aA)), bA && this.code(bA).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(K);
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
    _endBlockNode(S, R) {
      const aA = this._currNode;
      if (aA instanceof S || R && aA instanceof R)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${R ? `${S.kind}/${R.kind}` : S.kind}"`);
    }
    _elseNode(S) {
      const R = this._currNode;
      if (!(R instanceof U))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = R.else = S, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const S = this._nodes;
      return S[S.length - 1];
    }
    set _currNode(S) {
      const R = this._nodes;
      R[R.length - 1] = S;
    }
  }
  A.CodeGen = QA;
  function OA(j, S) {
    for (const R in S)
      j[R] = (j[R] || 0) + (S[R] || 0);
    return j;
  }
  function EA(j, S) {
    return S instanceof e._CodeOrName ? OA(j, S.names) : j;
  }
  function q(j, S, R) {
    if (j instanceof e.Name)
      return aA(j);
    if (!bA(j))
      return j;
    return new e._Code(j._items.reduce((_A, zA) => (zA instanceof e.Name && (zA = aA(zA)), zA instanceof e._Code ? _A.push(...zA._items) : _A.push(zA), _A), []));
    function aA(_A) {
      const zA = R[_A.str];
      return zA === void 0 || S[_A.str] !== 1 ? _A : (delete S[_A.str], zA);
    }
    function bA(_A) {
      return _A instanceof e._Code && _A._items.some((zA) => zA instanceof e.Name && S[zA.str] === 1 && R[zA.str] !== void 0);
    }
  }
  function CA(j, S) {
    for (const R in S)
      j[R] = (j[R] || 0) - (S[R] || 0);
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
    return (S, R) => S === e.nil ? R : R === e.nil ? S : (0, e._)`${rA(S)} ${j} ${rA(R)}`;
  }
  function rA(j) {
    return j instanceof e.Name ? j : (0, e._)`(${j})`;
  }
})(ve);
var RA = {};
Object.defineProperty(RA, "__esModule", { value: !0 });
RA.checkStrictMode = RA.getErrorPath = RA.Type = RA.useFunc = RA.setEvaluated = RA.evaluatedPropsToName = RA.mergeEvaluated = RA.eachItem = RA.unescapeJsonPointer = RA.escapeJsonPointer = RA.escapeFragment = RA.unescapeFragment = RA.schemaRefOrVal = RA.schemaHasRulesButRef = RA.schemaHasRules = RA.checkUnknownRules = RA.alwaysValidSchema = RA.toHash = void 0;
const $e = ve, SE = ys;
function LE(A) {
  const e = {};
  for (const t of A)
    e[t] = !0;
  return e;
}
RA.toHash = LE;
function TE(A, e) {
  return typeof e == "boolean" ? e : Object.keys(e).length === 0 ? !0 : (Xm(A, e), !qm(e, A.self.RULES.all));
}
RA.alwaysValidSchema = TE;
function Xm(A, e = A.schema) {
  const { opts: t, self: n } = A;
  if (!t.strictSchema || typeof e == "boolean")
    return;
  const i = n.RULES.keywords;
  for (const s in e)
    i[s] || jm(A, `unknown keyword: "${s}"`);
}
RA.checkUnknownRules = Xm;
function qm(A, e) {
  if (typeof A == "boolean")
    return !A;
  for (const t in A)
    if (e[t])
      return !0;
  return !1;
}
RA.schemaHasRules = qm;
function DE(A, e) {
  if (typeof A == "boolean")
    return !A;
  for (const t in A)
    if (t !== "$ref" && e.all[t])
      return !0;
  return !1;
}
RA.schemaHasRulesButRef = DE;
function OE({ topSchemaRef: A, schemaPath: e }, t, n, i) {
  if (!i) {
    if (typeof t == "number" || typeof t == "boolean")
      return t;
    if (typeof t == "string")
      return (0, $e._)`${t}`;
  }
  return (0, $e._)`${A}${e}${(0, $e.getProperty)(n)}`;
}
RA.schemaRefOrVal = OE;
function NE(A) {
  return zm(decodeURIComponent(A));
}
RA.unescapeFragment = NE;
function ME(A) {
  return encodeURIComponent(Hd(A));
}
RA.escapeFragment = ME;
function Hd(A) {
  return typeof A == "number" ? `${A}` : A.replace(/~/g, "~0").replace(/\//g, "~1");
}
RA.escapeJsonPointer = Hd;
function zm(A) {
  return A.replace(/~1/g, "/").replace(/~0/g, "~");
}
RA.unescapeJsonPointer = zm;
function PE(A, e) {
  if (Array.isArray(A))
    for (const t of A)
      e(t);
  else
    e(A);
}
RA.eachItem = PE;
function IB({ mergeNames: A, mergeToName: e, mergeValues: t, resultToName: n }) {
  return (i, s, l, f) => {
    const c = l === void 0 ? s : l instanceof $e.Name ? (s instanceof $e.Name ? A(i, s, l) : e(i, s, l), l) : s instanceof $e.Name ? (e(i, l, s), s) : t(s, l);
    return f === $e.Name && !(c instanceof $e.Name) ? n(i, c) : c;
  };
}
RA.mergeEvaluated = {
  props: IB({
    mergeNames: (A, e, t) => A.if((0, $e._)`${t} !== true && ${e} !== undefined`, () => {
      A.if((0, $e._)`${e} === true`, () => A.assign(t, !0), () => A.assign(t, (0, $e._)`${t} || {}`).code((0, $e._)`Object.assign(${t}, ${e})`));
    }),
    mergeToName: (A, e, t) => A.if((0, $e._)`${t} !== true`, () => {
      e === !0 ? A.assign(t, !0) : (A.assign(t, (0, $e._)`${t} || {}`), Sd(A, t, e));
    }),
    mergeValues: (A, e) => A === !0 ? !0 : { ...A, ...e },
    resultToName: Jm
  }),
  items: IB({
    mergeNames: (A, e, t) => A.if((0, $e._)`${t} !== true && ${e} !== undefined`, () => A.assign(t, (0, $e._)`${e} === true ? true : ${t} > ${e} ? ${t} : ${e}`)),
    mergeToName: (A, e, t) => A.if((0, $e._)`${t} !== true`, () => A.assign(t, e === !0 ? !0 : (0, $e._)`${t} > ${e} ? ${t} : ${e}`)),
    mergeValues: (A, e) => A === !0 ? !0 : Math.max(A, e),
    resultToName: (A, e) => A.var("items", e)
  })
};
function Jm(A, e) {
  if (e === !0)
    return A.var("props", !0);
  const t = A.var("props", (0, $e._)`{}`);
  return e !== void 0 && Sd(A, t, e), t;
}
RA.evaluatedPropsToName = Jm;
function Sd(A, e, t) {
  Object.keys(t).forEach((n) => A.assign((0, $e._)`${e}${(0, $e.getProperty)(n)}`, !0));
}
RA.setEvaluated = Sd;
const HB = {};
function KE(A, e) {
  return A.scopeValue("func", {
    ref: e,
    code: HB[e.code] || (HB[e.code] = new SE._Code(e.code))
  });
}
RA.useFunc = KE;
var Nh;
(function(A) {
  A[A.Num = 0] = "Num", A[A.Str = 1] = "Str";
})(Nh || (RA.Type = Nh = {}));
function RE(A, e, t) {
  if (A instanceof $e.Name) {
    const n = e === Nh.Num;
    return t ? n ? (0, $e._)`"[" + ${A} + "]"` : (0, $e._)`"['" + ${A} + "']"` : n ? (0, $e._)`"/" + ${A}` : (0, $e._)`"/" + ${A}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return t ? (0, $e.getProperty)(A).toString() : "/" + Hd(A);
}
RA.getErrorPath = RE;
function jm(A, e, t = A.opts.strictSchema) {
  if (t) {
    if (e = `strict mode: ${e}`, t === !0)
      throw new Error(e);
    A.self.logger.warn(e);
  }
}
RA.checkStrictMode = jm;
var lr = {};
Object.defineProperty(lr, "__esModule", { value: !0 });
const St = ve, kE = {
  // validation function arguments
  data: new St.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new St.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new St.Name("instancePath"),
  parentData: new St.Name("parentData"),
  parentDataProperty: new St.Name("parentDataProperty"),
  rootData: new St.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new St.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new St.Name("vErrors"),
  // null or array of validation errors
  errors: new St.Name("errors"),
  // counter of validation errors
  this: new St.Name("this"),
  // "globals"
  self: new St.Name("self"),
  scope: new St.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new St.Name("json"),
  jsonPos: new St.Name("jsonPos"),
  jsonLen: new St.Name("jsonLen"),
  jsonPart: new St.Name("jsonPart")
};
lr.default = kE;
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.extendErrors = A.resetErrorsCount = A.reportExtraError = A.reportError = A.keyword$DataError = A.keywordError = void 0;
  const e = ve, t = RA, n = lr;
  A.keywordError = {
    message: ({ keyword: F }) => (0, e.str)`must pass "${F}" keyword validation`
  }, A.keyword$DataError = {
    message: ({ keyword: F, schemaType: U }) => U ? (0, e.str)`"${F}" keyword must be ${U} ($data)` : (0, e.str)`"${F}" keyword is invalid ($data)`
  };
  function i(F, U = A.keywordError, H, D) {
    const { it: E } = F, { gen: M, compositeRule: K, allErrors: J } = E, hA = B(F, U, H);
    D ?? (K || J) ? c(M, hA) : h(E, (0, e._)`[${hA}]`);
  }
  A.reportError = i;
  function s(F, U = A.keywordError, H) {
    const { it: D } = F, { gen: E, compositeRule: M, allErrors: K } = D, J = B(F, U, H);
    c(E, J), M || K || h(D, n.default.vErrors);
  }
  A.reportExtraError = s;
  function l(F, U) {
    F.assign(n.default.errors, U), F.if((0, e._)`${n.default.vErrors} !== null`, () => F.if(U, () => F.assign((0, e._)`${n.default.vErrors}.length`, U), () => F.assign(n.default.vErrors, null)));
  }
  A.resetErrorsCount = l;
  function f({ gen: F, keyword: U, schemaValue: H, data: D, errsCount: E, it: M }) {
    if (E === void 0)
      throw new Error("ajv implementation error");
    const K = F.name("err");
    F.forRange("i", E, n.default.errors, (J) => {
      F.const(K, (0, e._)`${n.default.vErrors}[${J}]`), F.if((0, e._)`${K}.instancePath === undefined`, () => F.assign((0, e._)`${K}.instancePath`, (0, e.strConcat)(n.default.instancePath, M.errorPath))), F.assign((0, e._)`${K}.schemaPath`, (0, e.str)`${M.errSchemaPath}/${U}`), M.opts.verbose && (F.assign((0, e._)`${K}.schema`, H), F.assign((0, e._)`${K}.data`, D));
    });
  }
  A.extendErrors = f;
  function c(F, U) {
    const H = F.const("err", U);
    F.if((0, e._)`${n.default.vErrors} === null`, () => F.assign(n.default.vErrors, (0, e._)`[${H}]`), (0, e._)`${n.default.vErrors}.push(${H})`), F.code((0, e._)`${n.default.errors}++`);
  }
  function h(F, U) {
    const { gen: H, validateName: D, schemaEnv: E } = F;
    E.$async ? H.throw((0, e._)`new ${F.ValidationError}(${U})`) : (H.assign((0, e._)`${D}.errors`, U), H.return(!1));
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
    const { gen: D, it: E } = F, M = [
      v(E, H),
      o(F, H)
    ];
    return C(F, U, M), D.object(...M);
  }
  function v({ errorPath: F }, { instancePath: U }) {
    const H = U ? (0, e.str)`${F}${(0, t.getErrorPath)(U, t.Type.Str)}` : F;
    return [n.default.instancePath, (0, e.strConcat)(n.default.instancePath, H)];
  }
  function o({ keyword: F, it: { errSchemaPath: U } }, { schemaPath: H, parentSchema: D }) {
    let E = D ? U : (0, e.str)`${U}/${F}`;
    return H && (E = (0, e.str)`${E}${(0, t.getErrorPath)(H, t.Type.Str)}`), [w.schemaPath, E];
  }
  function C(F, { params: U, message: H }, D) {
    const { keyword: E, data: M, schemaValue: K, it: J } = F, { opts: hA, propertyName: cA, topSchemaRef: wA, schemaPath: QA } = J;
    D.push([w.keyword, E], [w.params, typeof U == "function" ? U(F) : U || (0, e._)`{}`]), hA.messages && D.push([w.message, typeof H == "function" ? H(F) : H]), hA.verbose && D.push([w.schema, K], [w.parentSchema, (0, e._)`${wA}${QA}`], [n.default.data, M]), cA && D.push([w.propertyName, cA]);
  }
})(Ls);
var SB;
function $E() {
  if (SB) return Ri;
  SB = 1, Object.defineProperty(Ri, "__esModule", { value: !0 }), Ri.boolOrEmptySchema = Ri.topBoolOrEmptySchema = void 0;
  const A = Ls, e = ve, t = lr, n = {
    message: "boolean schema is false"
  };
  function i(f) {
    const { gen: c, schema: h, validateName: w } = f;
    h === !1 ? l(f, !1) : typeof h == "object" && h.$async === !0 ? c.return(t.default.data) : (c.assign((0, e._)`${w}.errors`, null), c.return(!0));
  }
  Ri.topBoolOrEmptySchema = i;
  function s(f, c) {
    const { gen: h, schema: w } = f;
    w === !1 ? (h.var(c, !1), l(f)) : h.var(c, !0);
  }
  Ri.boolOrEmptySchema = s;
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
  return Ri;
}
var lt = {}, ta = {};
Object.defineProperty(ta, "__esModule", { value: !0 });
ta.getRules = ta.isJSONType = void 0;
const GE = ["string", "number", "integer", "boolean", "null", "object", "array"], VE = new Set(GE);
function WE(A) {
  return typeof A == "string" && VE.has(A);
}
ta.isJSONType = WE;
function XE() {
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
ta.getRules = XE;
var Sr = {}, LB;
function Ym() {
  if (LB) return Sr;
  LB = 1, Object.defineProperty(Sr, "__esModule", { value: !0 }), Sr.shouldUseRule = Sr.shouldUseGroup = Sr.schemaHasRulesForType = void 0;
  function A({ schema: n, self: i }, s) {
    const l = i.RULES.types[s];
    return l && l !== !0 && e(n, l);
  }
  Sr.schemaHasRulesForType = A;
  function e(n, i) {
    return i.rules.some((s) => t(n, s));
  }
  Sr.shouldUseGroup = e;
  function t(n, i) {
    var s;
    return n[i.keyword] !== void 0 || ((s = i.definition.implements) === null || s === void 0 ? void 0 : s.some((l) => n[l] !== void 0));
  }
  return Sr.shouldUseRule = t, Sr;
}
Object.defineProperty(lt, "__esModule", { value: !0 });
lt.reportTypeError = lt.checkDataTypes = lt.checkDataType = lt.coerceAndCheckDataType = lt.getJSONTypes = lt.getSchemaTypes = lt.DataType = void 0;
const qE = ta, zE = Ym(), JE = Ls, ge = ve, Zm = RA;
var Wa;
(function(A) {
  A[A.Correct = 0] = "Correct", A[A.Wrong = 1] = "Wrong";
})(Wa || (lt.DataType = Wa = {}));
function jE(A) {
  const e = Av(A.type);
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
lt.getSchemaTypes = jE;
function Av(A) {
  const e = Array.isArray(A) ? A : A ? [A] : [];
  if (e.every(qE.isJSONType))
    return e;
  throw new Error("type must be JSONType or JSONType[]: " + e.join(","));
}
lt.getJSONTypes = Av;
function YE(A, e) {
  const { gen: t, data: n, opts: i } = A, s = ZE(e, i.coerceTypes), l = e.length > 0 && !(s.length === 0 && e.length === 1 && (0, zE.schemaHasRulesForType)(A, e[0]));
  if (l) {
    const f = Ld(e, n, i.strictNumbers, Wa.Wrong);
    t.if(f, () => {
      s.length ? A1(A, e, s) : Td(A);
    });
  }
  return l;
}
lt.coerceAndCheckDataType = YE;
const ev = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function ZE(A, e) {
  return e ? A.filter((t) => ev.has(t) || e === "array" && t === "array") : [];
}
function A1(A, e, t) {
  const { gen: n, data: i, opts: s } = A, l = n.let("dataType", (0, ge._)`typeof ${i}`), f = n.let("coerced", (0, ge._)`undefined`);
  s.coerceTypes === "array" && n.if((0, ge._)`${l} == 'object' && Array.isArray(${i}) && ${i}.length == 1`, () => n.assign(i, (0, ge._)`${i}[0]`).assign(l, (0, ge._)`typeof ${i}`).if(Ld(e, i, s.strictNumbers), () => n.assign(f, i))), n.if((0, ge._)`${f} !== undefined`);
  for (const h of t)
    (ev.has(h) || h === "array" && s.coerceTypes === "array") && c(h);
  n.else(), Td(A), n.endIf(), n.if((0, ge._)`${f} !== undefined`, () => {
    n.assign(i, f), e1(A, f);
  });
  function c(h) {
    switch (h) {
      case "string":
        n.elseIf((0, ge._)`${l} == "number" || ${l} == "boolean"`).assign(f, (0, ge._)`"" + ${i}`).elseIf((0, ge._)`${i} === null`).assign(f, (0, ge._)`""`);
        return;
      case "number":
        n.elseIf((0, ge._)`${l} == "boolean" || ${i} === null
              || (${l} == "string" && ${i} && ${i} == +${i})`).assign(f, (0, ge._)`+${i}`);
        return;
      case "integer":
        n.elseIf((0, ge._)`${l} === "boolean" || ${i} === null
              || (${l} === "string" && ${i} && ${i} == +${i} && !(${i} % 1))`).assign(f, (0, ge._)`+${i}`);
        return;
      case "boolean":
        n.elseIf((0, ge._)`${i} === "false" || ${i} === 0 || ${i} === null`).assign(f, !1).elseIf((0, ge._)`${i} === "true" || ${i} === 1`).assign(f, !0);
        return;
      case "null":
        n.elseIf((0, ge._)`${i} === "" || ${i} === 0 || ${i} === false`), n.assign(f, null);
        return;
      case "array":
        n.elseIf((0, ge._)`${l} === "string" || ${l} === "number"
              || ${l} === "boolean" || ${i} === null`).assign(f, (0, ge._)`[${i}]`);
    }
  }
}
function e1({ gen: A, parentData: e, parentDataProperty: t }, n) {
  A.if((0, ge._)`${e} !== undefined`, () => A.assign((0, ge._)`${e}[${t}]`, n));
}
function Mh(A, e, t, n = Wa.Correct) {
  const i = n === Wa.Correct ? ge.operators.EQ : ge.operators.NEQ;
  let s;
  switch (A) {
    case "null":
      return (0, ge._)`${e} ${i} null`;
    case "array":
      s = (0, ge._)`Array.isArray(${e})`;
      break;
    case "object":
      s = (0, ge._)`${e} && typeof ${e} == "object" && !Array.isArray(${e})`;
      break;
    case "integer":
      s = l((0, ge._)`!(${e} % 1) && !isNaN(${e})`);
      break;
    case "number":
      s = l();
      break;
    default:
      return (0, ge._)`typeof ${e} ${i} ${A}`;
  }
  return n === Wa.Correct ? s : (0, ge.not)(s);
  function l(f = ge.nil) {
    return (0, ge.and)((0, ge._)`typeof ${e} == "number"`, f, t ? (0, ge._)`isFinite(${e})` : ge.nil);
  }
}
lt.checkDataType = Mh;
function Ld(A, e, t, n) {
  if (A.length === 1)
    return Mh(A[0], e, t, n);
  let i;
  const s = (0, Zm.toHash)(A);
  if (s.array && s.object) {
    const l = (0, ge._)`typeof ${e} != "object"`;
    i = s.null ? l : (0, ge._)`!${e} || ${l}`, delete s.null, delete s.array, delete s.object;
  } else
    i = ge.nil;
  s.number && delete s.integer;
  for (const l in s)
    i = (0, ge.and)(i, Mh(l, e, t, n));
  return i;
}
lt.checkDataTypes = Ld;
const t1 = {
  message: ({ schema: A }) => `must be ${A}`,
  params: ({ schema: A, schemaValue: e }) => typeof A == "string" ? (0, ge._)`{type: ${A}}` : (0, ge._)`{type: ${e}}`
};
function Td(A) {
  const e = n1(A);
  (0, JE.reportError)(e, t1);
}
lt.reportTypeError = Td;
function n1(A) {
  const { gen: e, data: t, schema: n } = A, i = (0, Zm.schemaRefOrVal)(A, n, "type");
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
function r1() {
  if (TB) return $o;
  TB = 1, Object.defineProperty($o, "__esModule", { value: !0 }), $o.assignDefaults = void 0;
  const A = ve, e = RA;
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
const Xe = ve, Dd = RA, ui = lr, i1 = RA;
function a1(A, e) {
  const { gen: t, data: n, it: i } = A;
  t.if(Nd(t, n, e, i.opts.ownProperties), () => {
    A.setParams({ missingProperty: (0, Xe._)`${e}` }, !0), A.error();
  });
}
me.checkReportMissingProp = a1;
function o1({ gen: A, data: e, it: { opts: t } }, n, i) {
  return (0, Xe.or)(...n.map((s) => (0, Xe.and)(Nd(A, e, s, t.ownProperties), (0, Xe._)`${i} = ${s}`)));
}
me.checkMissingProp = o1;
function s1(A, e) {
  A.setParams({ missingProperty: e }, !0), A.error();
}
me.reportMissingProp = s1;
function tv(A) {
  return A.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, Xe._)`Object.prototype.hasOwnProperty`
  });
}
me.hasPropFunc = tv;
function Od(A, e, t) {
  return (0, Xe._)`${tv(A)}.call(${e}, ${t})`;
}
me.isOwnProperty = Od;
function u1(A, e, t, n) {
  const i = (0, Xe._)`${e}${(0, Xe.getProperty)(t)} !== undefined`;
  return n ? (0, Xe._)`${i} && ${Od(A, e, t)}` : i;
}
me.propertyInData = u1;
function Nd(A, e, t, n) {
  const i = (0, Xe._)`${e}${(0, Xe.getProperty)(t)} === undefined`;
  return n ? (0, Xe.or)(i, (0, Xe.not)(Od(A, e, t))) : i;
}
me.noPropertyInData = Nd;
function nv(A) {
  return A ? Object.keys(A).filter((e) => e !== "__proto__") : [];
}
me.allSchemaProperties = nv;
function l1(A, e) {
  return nv(e).filter((t) => !(0, Dd.alwaysValidSchema)(A, e[t]));
}
me.schemaProperties = l1;
function c1({ schemaCode: A, data: e, it: { gen: t, topSchemaRef: n, schemaPath: i, errorPath: s }, it: l }, f, c, h) {
  const w = h ? (0, Xe._)`${A}, ${e}, ${n}${i}` : e, B = [
    [ui.default.instancePath, (0, Xe.strConcat)(ui.default.instancePath, s)],
    [ui.default.parentData, l.parentData],
    [ui.default.parentDataProperty, l.parentDataProperty],
    [ui.default.rootData, ui.default.rootData]
  ];
  l.opts.dynamicRef && B.push([ui.default.dynamicAnchors, ui.default.dynamicAnchors]);
  const p = (0, Xe._)`${w}, ${t.object(...B)}`;
  return c !== Xe.nil ? (0, Xe._)`${f}.call(${c}, ${p})` : (0, Xe._)`${f}(${p})`;
}
me.callValidateCode = c1;
const f1 = (0, Xe._)`new RegExp`;
function h1({ gen: A, it: { opts: e } }, t) {
  const n = e.unicodeRegExp ? "u" : "", { regExp: i } = e.code, s = i(t, n);
  return A.scopeValue("pattern", {
    key: s.toString(),
    ref: s,
    code: (0, Xe._)`${i.code === "new RegExp" ? f1 : (0, i1.useFunc)(A, i)}(${t}, ${n})`
  });
}
me.usePattern = h1;
function d1(A) {
  const { gen: e, data: t, keyword: n, it: i } = A, s = e.name("valid");
  if (i.allErrors) {
    const f = e.let("valid", !0);
    return l(() => e.assign(f, !1)), f;
  }
  return e.var(s, !0), l(() => e.break()), s;
  function l(f) {
    const c = e.const("len", (0, Xe._)`${t}.length`);
    e.forRange("i", 0, c, (h) => {
      A.subschema({
        keyword: n,
        dataProp: h,
        dataPropType: Dd.Type.Num
      }, s), e.if((0, Xe.not)(s), f);
    });
  }
}
me.validateArray = d1;
function p1(A) {
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
    e.assign(l, (0, Xe._)`${l} || ${f}`), A.mergeValidEvaluated(w, f) || e.if((0, Xe.not)(l));
  })), A.result(l, () => A.reset(), () => A.error(!0));
}
me.validateUnion = p1;
var DB;
function g1() {
  if (DB) return Mn;
  DB = 1, Object.defineProperty(Mn, "__esModule", { value: !0 }), Mn.validateKeywordUsage = Mn.validSchemaType = Mn.funcKeywordCode = Mn.macroKeywordCode = void 0;
  const A = ve, e = lr, t = me, n = Ls;
  function i(p, v) {
    const { gen: o, keyword: C, schema: F, parentSchema: U, it: H } = p, D = v.macro.call(H.self, F, U, H), E = h(o, C, D);
    H.opts.validateSchema !== !1 && H.self.validateSchema(D, !0);
    const M = o.name("valid");
    p.subschema({
      schema: D,
      schemaPath: A.nil,
      errSchemaPath: `${H.errSchemaPath}/${C}`,
      topSchemaRef: E,
      compositeRule: !0
    }, M), p.pass(M, () => p.error(!0));
  }
  Mn.macroKeywordCode = i;
  function s(p, v) {
    var o;
    const { gen: C, keyword: F, schema: U, parentSchema: H, $data: D, it: E } = p;
    c(E, v);
    const M = !D && v.compile ? v.compile.call(E.self, U, H, E) : v.validate, K = h(C, F, M), J = C.let("valid");
    p.block$data(J, hA), p.ok((o = v.valid) !== null && o !== void 0 ? o : J);
    function hA() {
      if (v.errors === !1)
        QA(), v.modifying && l(p), OA(() => p.error());
      else {
        const EA = v.async ? cA() : wA();
        v.modifying && l(p), OA(() => f(p, EA));
      }
    }
    function cA() {
      const EA = C.let("ruleErrs", null);
      return C.try(() => QA((0, A._)`await `), (q) => C.assign(J, !1).if((0, A._)`${q} instanceof ${E.ValidationError}`, () => C.assign(EA, (0, A._)`${q}.errors`), () => C.throw(q))), EA;
    }
    function wA() {
      const EA = (0, A._)`${K}.errors`;
      return C.assign(EA, null), QA(A.nil), EA;
    }
    function QA(EA = v.async ? (0, A._)`await ` : A.nil) {
      const q = E.opts.passContext ? e.default.this : e.default.self, CA = !("compile" in v && !D || v.schema === !1);
      C.assign(J, (0, A._)`${EA}${(0, t.callValidateCode)(p, K, q, CA)}`, v.modifying);
    }
    function OA(EA) {
      var q;
      C.if((0, A.not)((q = v.valid) !== null && q !== void 0 ? q : J), EA);
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
      const E = `keyword "${U}" value is invalid at path "${C}": ` + o.errorsText(F.validateSchema.errors);
      if (v.validateSchema === "log")
        o.logger.error(E);
      else
        throw new Error(E);
    }
  }
  return Mn.validateKeywordUsage = B, Mn;
}
var Lr = {}, OB;
function B1() {
  if (OB) return Lr;
  OB = 1, Object.defineProperty(Lr, "__esModule", { value: !0 }), Lr.extendSubschemaMode = Lr.extendSubschemaData = Lr.getSubschema = void 0;
  const A = ve, e = RA;
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
  Lr.getSubschema = t;
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
  Lr.extendSubschemaData = n;
  function i(s, { jtdDiscriminator: l, jtdMetadata: f, compositeRule: c, createErrors: h, allErrors: w }) {
    c !== void 0 && (s.compositeRule = c), h !== void 0 && (s.createErrors = h), w !== void 0 && (s.allErrors = w), s.jtdDiscriminator = l, s.jtdMetadata = f;
  }
  return Lr.extendSubschemaMode = i, Lr;
}
var Ct = {}, rv = function A(e, t) {
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
}, iv = { exports: {} }, pi = iv.exports = function(A, e, t) {
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
            Sl(A, e, t, B[v], i + "/" + w + "/" + w1(v), s, i, w, n, v);
      } else (w in pi.keywords || A.allKeys && !(w in pi.skipKeywords)) && Sl(A, e, t, B, i + "/" + w, s, i, w, n);
    }
    t(n, i, s, l, f, c, h);
  }
}
function w1(A) {
  return A.replace(/~/g, "~0").replace(/\//g, "~1");
}
var m1 = iv.exports;
Object.defineProperty(Ct, "__esModule", { value: !0 });
Ct.getSchemaRefs = Ct.resolveUrl = Ct.normalizeId = Ct._getFullPath = Ct.getFullPath = Ct.inlineRef = void 0;
const v1 = RA, y1 = rv, C1 = m1, Q1 = /* @__PURE__ */ new Set([
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
function F1(A, e = !0) {
  return typeof A == "boolean" ? !0 : e === !0 ? !Ph(A) : e ? av(A) <= e : !1;
}
Ct.inlineRef = F1;
const U1 = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function Ph(A) {
  for (const e in A) {
    if (U1.has(e))
      return !0;
    const t = A[e];
    if (Array.isArray(t) && t.some(Ph) || typeof t == "object" && Ph(t))
      return !0;
  }
  return !1;
}
function av(A) {
  let e = 0;
  for (const t in A) {
    if (t === "$ref")
      return 1 / 0;
    if (e++, !Q1.has(t) && (typeof A[t] == "object" && (0, v1.eachItem)(A[t], (n) => e += av(n)), e === 1 / 0))
      return 1 / 0;
  }
  return e;
}
function ov(A, e = "", t) {
  t !== !1 && (e = Xa(e));
  const n = A.parse(e);
  return sv(A, n);
}
Ct.getFullPath = ov;
function sv(A, e) {
  return A.serialize(e).split("#")[0] + "#";
}
Ct._getFullPath = sv;
const b1 = /#\/?$/;
function Xa(A) {
  return A ? A.replace(b1, "") : "";
}
Ct.normalizeId = Xa;
function E1(A, e, t) {
  return t = Xa(t), A.resolve(e, t);
}
Ct.resolveUrl = E1;
const _1 = /^[a-z_][-a-z0-9._]*$/i;
function x1(A, e) {
  if (typeof A == "boolean")
    return {};
  const { schemaId: t, uriResolver: n } = this.opts, i = Xa(A[t] || e), s = { "": i }, l = ov(n, i, !1), f = {}, c = /* @__PURE__ */ new Set();
  return C1(A, { allKeys: !0 }, (B, p, v, o) => {
    if (o === void 0)
      return;
    const C = l + p;
    let F = s[o];
    typeof B[t] == "string" && (F = U.call(this, B[t])), H.call(this, B.$anchor), H.call(this, B.$dynamicAnchor), s[p] = F;
    function U(D) {
      const E = this.opts.uriResolver.resolve;
      if (D = Xa(F ? E(F, D) : D), c.has(D))
        throw w(D);
      c.add(D);
      let M = this.refs[D];
      return typeof M == "string" && (M = this.refs[M]), typeof M == "object" ? h(B, M.schema, D) : D !== Xa(C) && (D[0] === "#" ? (h(B, f[D], D), f[D] = B) : this.refs[D] = C), D;
    }
    function H(D) {
      if (typeof D == "string") {
        if (!_1.test(D))
          throw new Error(`invalid anchor "${D}"`);
        U.call(this, `#${D}`);
      }
    }
  }), f;
  function h(B, p, v) {
    if (p !== void 0 && !y1(B, p))
      throw w(v);
  }
  function w(B) {
    return new Error(`reference "${B}" resolves to more than one schema`);
  }
}
Ct.getSchemaRefs = x1;
var NB;
function yc() {
  if (NB) return Hr;
  NB = 1, Object.defineProperty(Hr, "__esModule", { value: !0 }), Hr.getData = Hr.KeywordCxt = Hr.validateFunctionCode = void 0;
  const A = $E(), e = lt, t = Ym(), n = lt, i = r1(), s = g1(), l = B1(), f = ve, c = lr, h = Ct, w = RA, B = Ls;
  function p(X) {
    if (M(X) && (J(X), E(X))) {
      F(X);
      return;
    }
    v(X, () => (0, A.topBoolOrEmptySchema)(X));
  }
  Hr.validateFunctionCode = p;
  function v({ gen: X, validateName: V, schema: k, schemaEnv: eA, opts: lA }, TA) {
    lA.code.es5 ? X.func(V, (0, f._)`${c.default.data}, ${c.default.valCxt}`, eA.$async, () => {
      X.code((0, f._)`"use strict"; ${H(k, lA)}`), C(X, lA), X.code(TA);
    }) : X.func(V, (0, f._)`${c.default.data}, ${o(lA)}`, eA.$async, () => X.code(H(k, lA)).code(TA));
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
      k.$comment && V.$comment && EA(X), wA(X), eA.let(c.default.vErrors, null), eA.let(c.default.errors, 0), k.unevaluated && U(X), hA(X), q(X);
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
    if (M(X) && (J(X), E(X))) {
      K(X, V);
      return;
    }
    (0, A.boolOrEmptySchema)(X, V);
  }
  function E({ schema: X, self: V }) {
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
  function K(X, V) {
    const { schema: k, gen: eA, opts: lA } = X;
    lA.$comment && k.$comment && EA(X), QA(X), OA(X);
    const TA = eA.const("_errs", c.default.errors);
    hA(X, TA), eA.var(V, (0, f._)`${TA} === ${c.default.errors}`);
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
  function EA({ gen: X, schemaEnv: V, schema: k, errSchemaPath: eA, opts: lA }) {
    const TA = k.$comment;
    if (lA.$comment === !0)
      X.code((0, f._)`${c.default.self}.logger.log(${TA})`);
    else if (typeof lA.$comment == "function") {
      const jA = (0, f.str)`${eA}/$comment`, se = X.scopeValue("root", { ref: V.root });
      X.code((0, f._)`${c.default.self}.opts.$comment(${TA}, ${jA}, ${se}.schema)`);
    }
  }
  function q(X) {
    const { gen: V, schemaEnv: k, validateName: eA, ValidationError: lA, opts: TA } = X;
    k.$async ? V.if((0, f._)`${c.default.errors} === 0`, () => V.return(c.default.data), () => V.throw((0, f._)`new ${lA}(${c.default.vErrors})`)) : (V.assign((0, f._)`${eA}.errors`, c.default.vErrors), TA.unevaluated && CA(X), V.return((0, f._)`${c.default.errors} === 0`));
  }
  function CA({ gen: X, evaluated: V, props: k, items: eA }) {
    k instanceof f.Name && X.assign((0, f._)`${V}.props`, k), eA instanceof f.Name && X.assign((0, f._)`${V}.items`, eA);
  }
  function iA(X, V, k, eA) {
    const { gen: lA, schema: TA, data: jA, allErrors: se, opts: xe, self: fe } = X, { RULES: he } = fe;
    if (TA.$ref && (xe.ignoreKeywordsWithRef || !(0, w.schemaHasRulesButRef)(TA, he))) {
      lA.block(() => bA(X, "$ref", he.all.$ref.definition));
      return;
    }
    xe.jtd || IA(X, V), lA.block(() => {
      for (const ce of he.rules)
        Te(ce);
      Te(he.post);
    });
    function Te(ce) {
      (0, t.shouldUseGroup)(TA, ce) && (ce.type ? (lA.if((0, n.checkDataType)(ce.type, jA, xe.strictNumbers)), gA(X, ce), V.length === 1 && V[0] === ce.type && k && (lA.else(), (0, n.reportTypeError)(X)), lA.endIf()) : gA(X, ce), se || lA.if((0, f._)`${c.default.errors} === ${eA || 0}`));
    }
  }
  function gA(X, V) {
    const { gen: k, schema: eA, opts: { useDefaults: lA } } = X;
    lA && (0, i.assignDefaults)(X, V.type), k.block(() => {
      for (const TA of V.rules)
        (0, t.shouldUseRule)(eA, TA) && bA(X, TA.keyword, TA.definition, V.type);
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
        j(X.dataTypes, k) || R(X, `type "${k}" not allowed by context "${X.dataTypes.join(",")}"`);
      }), S(X, V);
    }
  }
  function uA(X, V) {
    V.length > 1 && !(V.length === 2 && V.includes("null")) && R(X, "use allowUnionTypes to allow union type keyword");
  }
  function T(X, V) {
    const k = X.self.RULES.all;
    for (const eA in k) {
      const lA = k[eA];
      if (typeof lA == "object" && (0, t.shouldUseRule)(X.schema, lA)) {
        const { type: TA } = lA.definition;
        TA.length && !TA.some((jA) => rA(V, jA)) && R(X, `missing type "${TA.join(",")}" for keyword "${eA}"`);
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
  function R(X, V) {
    const k = X.schemaEnv.baseId + X.errSchemaPath;
    V += ` at "${k}" (strictTypes)`, (0, w.checkStrictMode)(X, V, X.opts.strictTypes);
  }
  class aA {
    constructor(V, k, eA) {
      if ((0, s.validateKeywordUsage)(V, k, eA), this.gen = V.gen, this.allErrors = V.allErrors, this.keyword = eA, this.data = V.data, this.schema = V.schema[eA], this.$data = k.$data && V.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, w.schemaRefOrVal)(V, this.schema, eA, this.$data), this.schemaType = k.schemaType, this.parentSchema = V.schema, this.params = {}, this.it = V, this.def = k, this.$data)
        this.schemaCode = V.gen.const("vSchema", JA(this.$data, V));
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
      const { gen: eA, schemaCode: lA, schemaType: TA, def: jA } = this;
      eA.if((0, f.or)((0, f._)`${lA} === undefined`, k)), V !== f.nil && eA.assign(V, !0), (TA.length || jA.validateSchema) && (eA.elseIf(this.invalid$data()), this.$dataError(), V !== f.nil && eA.assign(V, !1)), eA.else();
    }
    invalid$data() {
      const { gen: V, schemaCode: k, schemaType: eA, def: lA, it: TA } = this;
      return (0, f.or)(jA(), se());
      function jA() {
        if (eA.length) {
          if (!(k instanceof f.Name))
            throw new Error("ajv implementation error");
          const xe = Array.isArray(eA) ? eA : [eA];
          return (0, f._)`${(0, n.checkDataTypes)(xe, k, TA.opts.strictNumbers, n.DataType.Wrong)}`;
        }
        return f.nil;
      }
      function se() {
        if (lA.validateSchema) {
          const xe = V.scopeValue("validate$data", { ref: lA.validateSchema });
          return (0, f._)`!${xe}(${k})`;
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
  function bA(X, V, k, eA) {
    const lA = new aA(X, k, V);
    "code" in k ? k.code(lA, eA) : lA.$data && k.validate ? (0, s.funcKeywordCode)(lA, k) : "macro" in k ? (0, s.macroKeywordCode)(lA, k) : (k.compile || k.validate) && (0, s.funcKeywordCode)(lA, k);
  }
  const _A = /^\/(?:[^~]|~0|~1)*$/, zA = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function JA(X, { dataLevel: V, dataNames: k, dataPathArr: eA }) {
    let lA, TA;
    if (X === "")
      return c.default.rootData;
    if (X[0] === "/") {
      if (!_A.test(X))
        throw new Error(`Invalid JSON-pointer: ${X}`);
      lA = X, TA = c.default.rootData;
    } else {
      const fe = zA.exec(X);
      if (!fe)
        throw new Error(`Invalid JSON-pointer: ${X}`);
      const he = +fe[1];
      if (lA = fe[2], lA === "#") {
        if (he >= V)
          throw new Error(xe("property/index", he));
        return eA[V - he];
      }
      if (he > V)
        throw new Error(xe("data", he));
      if (TA = k[V - he], !lA)
        return TA;
    }
    let jA = TA;
    const se = lA.split("/");
    for (const fe of se)
      fe && (TA = (0, f._)`${TA}${(0, f.getProperty)((0, w.unescapeJsonPointer)(fe))}`, jA = (0, f._)`${jA} && ${TA}`);
    return jA;
    function xe(fe, he) {
      return `Cannot access ${fe} ${he} levels up, current level is ${V}`;
    }
  }
  return Hr.getData = JA, Hr;
}
var Ts = {};
Object.defineProperty(Ts, "__esModule", { value: !0 });
class I1 extends Error {
  constructor(e) {
    super("validation failed"), this.errors = e, this.ajv = this.validation = !0;
  }
}
Ts.default = I1;
var oo = {};
Object.defineProperty(oo, "__esModule", { value: !0 });
const eh = Ct;
class H1 extends Error {
  constructor(e, t, n, i) {
    super(i || `can't resolve reference ${n} from id ${t}`), this.missingRef = (0, eh.resolveUrl)(e, t, n), this.missingSchema = (0, eh.normalizeId)((0, eh.getFullPath)(e, this.missingRef));
  }
}
oo.default = H1;
var jt = {};
Object.defineProperty(jt, "__esModule", { value: !0 });
jt.resolveSchema = jt.getCompilingSchema = jt.resolveRef = jt.compileSchema = jt.SchemaEnv = void 0;
const Pn = ve, S1 = Ts, ki = lr, Gn = Ct, MB = RA, L1 = yc();
class Cc {
  constructor(e) {
    var t;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof e.schema == "object" && (n = e.schema), this.schema = e.schema, this.schemaId = e.schemaId, this.root = e.root || this, this.baseId = (t = e.baseId) !== null && t !== void 0 ? t : (0, Gn.normalizeId)(n == null ? void 0 : n[e.schemaId || "$id"]), this.schemaPath = e.schemaPath, this.localRefs = e.localRefs, this.meta = e.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
jt.SchemaEnv = Cc;
function Md(A) {
  const e = uv.call(this, A);
  if (e)
    return e;
  const t = (0, Gn.getFullPath)(this.opts.uriResolver, A.root.baseId), { es5: n, lines: i } = this.opts.code, { ownProperties: s } = this.opts, l = new Pn.CodeGen(this.scope, { es5: n, lines: i, ownProperties: s });
  let f;
  A.$async && (f = l.scopeValue("Error", {
    ref: S1.default,
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
    this._compilations.add(A), (0, L1.validateFunctionCode)(h), l.optimize(this.opts.code.optimize);
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
jt.compileSchema = Md;
function T1(A, e, t) {
  var n;
  t = (0, Gn.resolveUrl)(this.opts.uriResolver, e, t);
  const i = A.refs[t];
  if (i)
    return i;
  let s = N1.call(this, A, t);
  if (s === void 0) {
    const l = (n = A.localRefs) === null || n === void 0 ? void 0 : n[t], { schemaId: f } = this.opts;
    l && (s = new Cc({ schema: l, schemaId: f, root: A, baseId: e }));
  }
  if (s !== void 0)
    return A.refs[t] = D1.call(this, s);
}
jt.resolveRef = T1;
function D1(A) {
  return (0, Gn.inlineRef)(A.schema, this.opts.inlineRefs) ? A.schema : A.validate ? A : Md.call(this, A);
}
function uv(A) {
  for (const e of this._compilations)
    if (O1(e, A))
      return e;
}
jt.getCompilingSchema = uv;
function O1(A, e) {
  return A.schema === e.schema && A.root === e.root && A.baseId === e.baseId;
}
function N1(A, e) {
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
    if (l.validate || Md.call(this, l), s === (0, Gn.normalizeId)(e)) {
      const { schema: f } = l, { schemaId: c } = this.opts, h = f[c];
      return h && (i = (0, Gn.resolveUrl)(this.opts.uriResolver, i, h)), new Cc({ schema: f, schemaId: c, root: A, baseId: i });
    }
    return th.call(this, t, l);
  }
}
jt.resolveSchema = Qc;
const M1 = /* @__PURE__ */ new Set([
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
    const c = t[(0, MB.unescapeFragment)(f)];
    if (c === void 0)
      return;
    t = c;
    const h = typeof t == "object" && t[this.opts.schemaId];
    !M1.has(f) && h && (e = (0, Gn.resolveUrl)(this.opts.uriResolver, e, h));
  }
  let s;
  if (typeof t != "boolean" && t.$ref && !(0, MB.schemaHasRulesButRef)(t, this.RULES)) {
    const f = (0, Gn.resolveUrl)(this.opts.uriResolver, e, t.$ref);
    s = Qc.call(this, n, f);
  }
  const { schemaId: l } = this.opts;
  if (s = s || new Cc({ schema: t, schemaId: l, root: n, baseId: e }), s.schema !== s.root.schema)
    return s;
}
const P1 = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", K1 = "Meta-schema for $data reference (JSON AnySchema extension proposal)", R1 = "object", k1 = [
  "$data"
], $1 = {
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
}, G1 = !1, V1 = {
  $id: P1,
  description: K1,
  type: R1,
  required: k1,
  properties: $1,
  additionalProperties: G1
};
var Pd = {}, Fc = { exports: {} };
const W1 = {
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
var X1 = {
  HEX: W1
};
const { HEX: q1 } = X1;
function lv(A) {
  if (fv(A, ".") < 3)
    return { host: A, isIPV4: !1 };
  const e = A.match(/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/u) || [], [t] = e;
  return t ? { host: J1(t, "."), isIPV4: !0 } : { host: A, isIPV4: !1 };
}
function Kh(A, e = !1) {
  let t = "", n = !0;
  for (const i of A) {
    if (q1[i] === void 0) return;
    i !== "0" && n === !0 && (n = !1), n || (t += i);
  }
  return e && t.length === 0 && (t = "0"), t;
}
function z1(A) {
  let e = 0;
  const t = { error: !1, address: "", zone: "" }, n = [], i = [];
  let s = !1, l = !1, f = !1;
  function c() {
    if (i.length) {
      if (s === !1) {
        const h = Kh(i);
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
  return i.length && (s ? t.zone = i.join("") : f ? n.push(i.join("")) : n.push(Kh(i))), t.address = n.join(""), t;
}
function cv(A, e = {}) {
  if (fv(A, ":") < 2)
    return { host: A, isIPV6: !1 };
  const t = z1(A);
  if (t.error)
    return { host: A, isIPV6: !1 };
  {
    let n = t.address, i = t.address;
    return t.zone && (n += "%" + t.zone, i += "%25" + t.zone), { host: n, escapedHost: i, isIPV6: !0 };
  }
}
function J1(A, e) {
  let t = "", n = !0;
  const i = A.length;
  for (let s = 0; s < i; s++) {
    const l = A[s];
    l === "0" && n ? (s + 1 <= i && A[s + 1] === e || s + 1 === i) && (t += l, n = !1) : (l === e ? n = !0 : n = !1, t += l);
  }
  return t;
}
function fv(A, e) {
  let t = 0;
  for (let n = 0; n < A.length; n++)
    A[n] === e && t++;
  return t;
}
const PB = /^\.\.?\//u, KB = /^\/\.(?:\/|$)/u, RB = /^\/\.\.(?:\/|$)/u, j1 = /^\/?(?:.|\n)*?(?=\/|$)/u;
function Y1(A) {
  const e = [];
  for (; A.length; )
    if (A.match(PB))
      A = A.replace(PB, "");
    else if (A.match(KB))
      A = A.replace(KB, "/");
    else if (A.match(RB))
      A = A.replace(RB, "/"), e.pop();
    else if (A === "." || A === "..")
      A = "";
    else {
      const t = A.match(j1);
      if (t) {
        const n = t[0];
        A = A.slice(n.length), e.push(n);
      } else
        throw new Error("Unexpected dot segment condition");
    }
  return e.join("");
}
function Z1(A, e) {
  const t = e !== !0 ? escape : unescape;
  return A.scheme !== void 0 && (A.scheme = t(A.scheme)), A.userinfo !== void 0 && (A.userinfo = t(A.userinfo)), A.host !== void 0 && (A.host = t(A.host)), A.path !== void 0 && (A.path = t(A.path)), A.query !== void 0 && (A.query = t(A.query)), A.fragment !== void 0 && (A.fragment = t(A.fragment)), A;
}
function A_(A, e) {
  const t = [];
  if (A.userinfo !== void 0 && (t.push(A.userinfo), t.push("@")), A.host !== void 0) {
    let n = unescape(A.host);
    const i = lv(n);
    if (i.isIPV4)
      n = i.host;
    else {
      const s = cv(i.host, { isIPV4: !1 });
      s.isIPV6 === !0 ? n = `[${s.escapedHost}]` : n = A.host;
    }
    t.push(n);
  }
  return (typeof A.port == "number" || typeof A.port == "string") && (t.push(":"), t.push(String(A.port))), t.length ? t.join("") : void 0;
}
var e_ = {
  recomposeAuthority: A_,
  normalizeComponentEncoding: Z1,
  removeDotSegments: Y1,
  normalizeIPv4: lv,
  normalizeIPv6: cv,
  stringArrayToHexStripped: Kh
};
const t_ = /^[\da-f]{8}\b-[\da-f]{4}\b-[\da-f]{4}\b-[\da-f]{4}\b-[\da-f]{12}$/iu, n_ = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function hv(A) {
  return typeof A.secure == "boolean" ? A.secure : String(A.scheme).toLowerCase() === "wss";
}
function dv(A) {
  return A.host || (A.error = A.error || "HTTP URIs must have a host."), A;
}
function pv(A) {
  const e = String(A.scheme).toLowerCase() === "https";
  return (A.port === (e ? 443 : 80) || A.port === "") && (A.port = void 0), A.path || (A.path = "/"), A;
}
function r_(A) {
  return A.secure = hv(A), A.resourceName = (A.path || "/") + (A.query ? "?" + A.query : ""), A.path = void 0, A.query = void 0, A;
}
function i_(A) {
  if ((A.port === (hv(A) ? 443 : 80) || A.port === "") && (A.port = void 0), typeof A.secure == "boolean" && (A.scheme = A.secure ? "wss" : "ws", A.secure = void 0), A.resourceName) {
    const [e, t] = A.resourceName.split("?");
    A.path = e && e !== "/" ? e : void 0, A.query = t, A.resourceName = void 0;
  }
  return A.fragment = void 0, A;
}
function a_(A, e) {
  if (!A.path)
    return A.error = "URN can not be parsed", A;
  const t = A.path.match(n_);
  if (t) {
    const n = e.scheme || A.scheme || "urn";
    A.nid = t[1].toLowerCase(), A.nss = t[2];
    const i = `${n}:${e.nid || A.nid}`, s = Kd[i];
    A.path = void 0, s && (A = s.parse(A, e));
  } else
    A.error = A.error || "URN can not be parsed.";
  return A;
}
function o_(A, e) {
  const t = e.scheme || A.scheme || "urn", n = A.nid.toLowerCase(), i = `${t}:${e.nid || n}`, s = Kd[i];
  s && (A = s.serialize(A, e));
  const l = A, f = A.nss;
  return l.path = `${n || e.nid}:${f}`, e.skipEscape = !0, l;
}
function s_(A, e) {
  const t = A;
  return t.uuid = t.nss, t.nss = void 0, !e.tolerant && (!t.uuid || !t_.test(t.uuid)) && (t.error = t.error || "UUID is not valid."), t;
}
function u_(A) {
  const e = A;
  return e.nss = (A.uuid || "").toLowerCase(), e;
}
const gv = {
  scheme: "http",
  domainHost: !0,
  parse: dv,
  serialize: pv
}, l_ = {
  scheme: "https",
  domainHost: gv.domainHost,
  parse: dv,
  serialize: pv
}, Ll = {
  scheme: "ws",
  domainHost: !0,
  parse: r_,
  serialize: i_
}, c_ = {
  scheme: "wss",
  domainHost: Ll.domainHost,
  parse: Ll.parse,
  serialize: Ll.serialize
}, f_ = {
  scheme: "urn",
  parse: a_,
  serialize: o_,
  skipNormalize: !0
}, h_ = {
  scheme: "urn:uuid",
  parse: s_,
  serialize: u_,
  skipNormalize: !0
}, Kd = {
  http: gv,
  https: l_,
  ws: Ll,
  wss: c_,
  urn: f_,
  "urn:uuid": h_
};
var d_ = Kd;
const { normalizeIPv6: p_, normalizeIPv4: g_, removeDotSegments: Yo, recomposeAuthority: B_, normalizeComponentEncoding: qu } = e_, Rd = d_;
function w_(A, e) {
  return typeof A == "string" ? A = ar(Kr(A, e), e) : typeof A == "object" && (A = Kr(ar(A, e), e)), A;
}
function m_(A, e, t) {
  const n = Object.assign({ scheme: "null" }, t), i = Bv(Kr(A, n), Kr(e, n), n, !0);
  return ar(i, { ...n, skipEscape: !0 });
}
function Bv(A, e, t, n) {
  const i = {};
  return n || (A = Kr(ar(A, t), t), e = Kr(ar(e, t), t)), t = t || {}, !t.tolerant && e.scheme ? (i.scheme = e.scheme, i.userinfo = e.userinfo, i.host = e.host, i.port = e.port, i.path = Yo(e.path || ""), i.query = e.query) : (e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0 ? (i.userinfo = e.userinfo, i.host = e.host, i.port = e.port, i.path = Yo(e.path || ""), i.query = e.query) : (e.path ? (e.path.charAt(0) === "/" ? i.path = Yo(e.path) : ((A.userinfo !== void 0 || A.host !== void 0 || A.port !== void 0) && !A.path ? i.path = "/" + e.path : A.path ? i.path = A.path.slice(0, A.path.lastIndexOf("/") + 1) + e.path : i.path = e.path, i.path = Yo(i.path)), i.query = e.query) : (i.path = A.path, e.query !== void 0 ? i.query = e.query : i.query = A.query), i.userinfo = A.userinfo, i.host = A.host, i.port = A.port), i.scheme = A.scheme), i.fragment = e.fragment, i;
}
function v_(A, e, t) {
  return typeof A == "string" ? (A = unescape(A), A = ar(qu(Kr(A, t), !0), { ...t, skipEscape: !0 })) : typeof A == "object" && (A = ar(qu(A, !0), { ...t, skipEscape: !0 })), typeof e == "string" ? (e = unescape(e), e = ar(qu(Kr(e, t), !0), { ...t, skipEscape: !0 })) : typeof e == "object" && (e = ar(qu(e, !0), { ...t, skipEscape: !0 })), A.toLowerCase() === e.toLowerCase();
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
  }, n = Object.assign({}, e), i = [], s = Rd[(n.scheme || t.scheme || "").toLowerCase()];
  s && s.serialize && s.serialize(t, n), t.path !== void 0 && (n.skipEscape ? t.path = unescape(t.path) : (t.path = escape(t.path), t.scheme !== void 0 && (t.path = t.path.split("%3A").join(":")))), n.reference !== "suffix" && t.scheme && (i.push(t.scheme), i.push(":"));
  const l = B_(t, n);
  if (l !== void 0 && (n.reference !== "suffix" && i.push("//"), i.push(l), t.path && t.path.charAt(0) !== "/" && i.push("/")), t.path !== void 0) {
    let f = t.path;
    !n.absolutePath && (!s || !s.absolutePath) && (f = Yo(f)), l === void 0 && (f = f.replace(/^\/\//u, "/%2F")), i.push(f);
  }
  return t.query !== void 0 && (i.push("?"), i.push(t.query)), t.fragment !== void 0 && (i.push("#"), i.push(t.fragment)), i.join("");
}
const y_ = Array.from({ length: 127 }, (A, e) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(e)));
function C_(A) {
  let e = 0;
  for (let t = 0, n = A.length; t < n; ++t)
    if (e = A.charCodeAt(t), e > 126 || y_[e])
      return !0;
  return !1;
}
const Q_ = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function Kr(A, e) {
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
  const l = A.match(Q_);
  if (l) {
    if (n.scheme = l[1], n.userinfo = l[3], n.host = l[4], n.port = parseInt(l[5], 10), n.path = l[6] || "", n.query = l[7], n.fragment = l[8], isNaN(n.port) && (n.port = l[5]), n.host) {
      const c = g_(n.host);
      if (c.isIPV4 === !1) {
        const h = p_(c.host, { isIPV4: !1 });
        n.host = h.host.toLowerCase(), s = h.isIPV6;
      } else
        n.host = c.host, s = !0;
    }
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && !n.path && n.query === void 0 ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", t.reference && t.reference !== "suffix" && t.reference !== n.reference && (n.error = n.error || "URI is not a " + t.reference + " reference.");
    const f = Rd[(t.scheme || n.scheme || "").toLowerCase()];
    if (!t.unicodeSupport && (!f || !f.unicodeSupport) && n.host && (t.domainHost || f && f.domainHost) && s === !1 && C_(n.host))
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
const kd = {
  SCHEMES: Rd,
  normalize: w_,
  resolve: m_,
  resolveComponents: Bv,
  equal: v_,
  serialize: ar,
  parse: Kr
};
Fc.exports = kd;
Fc.exports.default = kd;
Fc.exports.fastUri = kd;
var F_ = Fc.exports;
Object.defineProperty(Pd, "__esModule", { value: !0 });
const wv = F_;
wv.code = 'require("ajv/dist/runtime/uri").default';
Pd.default = wv;
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
  const n = Ts, i = oo, s = ta, l = jt, f = ve, c = Ct, h = lt, w = RA, B = V1, p = Pd, v = (uA, T) => new RegExp(uA, T);
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
    var T, rA, j, S, R, aA, bA, _A, zA, JA, X, V, k, eA, lA, TA, jA, se, xe, fe, he, Te, ce, Dt, Ft;
    const Ot = uA.strict, Ut = (T = uA.code) === null || T === void 0 ? void 0 : T.optimize, gt = Ut === !0 || Ut === void 0 ? 1 : Ut || 0, un = (j = (rA = uA.code) === null || rA === void 0 ? void 0 : rA.regExp) !== null && j !== void 0 ? j : v, dr = (S = uA.uriResolver) !== null && S !== void 0 ? S : p.default;
    return {
      strictSchema: (aA = (R = uA.strictSchema) !== null && R !== void 0 ? R : Ot) !== null && aA !== void 0 ? aA : !0,
      strictNumbers: (_A = (bA = uA.strictNumbers) !== null && bA !== void 0 ? bA : Ot) !== null && _A !== void 0 ? _A : !0,
      strictTypes: (JA = (zA = uA.strictTypes) !== null && zA !== void 0 ? zA : Ot) !== null && JA !== void 0 ? JA : "log",
      strictTuples: (V = (X = uA.strictTuples) !== null && X !== void 0 ? X : Ot) !== null && V !== void 0 ? V : "log",
      strictRequired: (eA = (k = uA.strictRequired) !== null && k !== void 0 ? k : Ot) !== null && eA !== void 0 ? eA : !1,
      code: uA.code ? { ...uA.code, optimize: gt, regExp: un } : { optimize: gt, regExp: un },
      loopRequired: (lA = uA.loopRequired) !== null && lA !== void 0 ? lA : H,
      loopEnum: (TA = uA.loopEnum) !== null && TA !== void 0 ? TA : H,
      meta: (jA = uA.meta) !== null && jA !== void 0 ? jA : !0,
      messages: (se = uA.messages) !== null && se !== void 0 ? se : !0,
      inlineRefs: (xe = uA.inlineRefs) !== null && xe !== void 0 ? xe : !0,
      schemaId: (fe = uA.schemaId) !== null && fe !== void 0 ? fe : "$id",
      addUsedSchema: (he = uA.addUsedSchema) !== null && he !== void 0 ? he : !0,
      validateSchema: (Te = uA.validateSchema) !== null && Te !== void 0 ? Te : !0,
      validateFormats: (ce = uA.validateFormats) !== null && ce !== void 0 ? ce : !0,
      unicodeRegExp: (Dt = uA.unicodeRegExp) !== null && Dt !== void 0 ? Dt : !0,
      int32range: (Ft = uA.int32range) !== null && Ft !== void 0 ? Ft : !0,
      uriResolver: dr
    };
  }
  class E {
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
      async function S(JA, X) {
        await R.call(this, JA.$schema);
        const V = this._addSchema(JA, X);
        return V.validate || aA.call(this, V);
      }
      async function R(JA) {
        JA && !this.getSchema(JA) && await S.call(this, { $ref: JA }, !0);
      }
      async function aA(JA) {
        try {
          return this._compileSchemaEnv(JA);
        } catch (X) {
          if (!(X instanceof i.default))
            throw X;
          return bA.call(this, X), await _A.call(this, X.missingSchema), aA.call(this, JA);
        }
      }
      function bA({ missingSchema: JA, missingRef: X }) {
        if (this.refs[JA])
          throw new Error(`AnySchema ${JA} is loaded but ${X} cannot be resolved`);
      }
      async function _A(JA) {
        const X = await zA.call(this, JA);
        this.refs[JA] || await R.call(this, X.$schema), this.refs[JA] || this.addSchema(X, JA, rA);
      }
      async function zA(JA) {
        const X = this._loading[JA];
        if (X)
          return X;
        try {
          return await (this._loading[JA] = j(JA));
        } finally {
          delete this._loading[JA];
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
      let R;
      if (typeof T == "object") {
        const { schemaId: aA } = this.opts;
        if (R = T[aA], R !== void 0 && typeof R != "string")
          throw new Error(`schema ${aA} must be string`);
      }
      return rA = (0, c.normalizeId)(rA || R), this._checkUnique(rA), this.schemas[rA] = this._addSchema(T, j, rA, S, !0), this;
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
        const R = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(R);
        else
          throw new Error(R);
      }
      return S;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(T) {
      let rA;
      for (; typeof (rA = K.call(this, T)) == "string"; )
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
          const rA = K.call(this, T);
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
        return (0, w.eachItem)(j, (R) => CA.call(this, R)), this;
      gA.call(this, rA);
      const S = {
        ...rA,
        type: (0, h.getJSONTypes)(rA.type),
        schemaType: (0, h.getJSONTypes)(rA.schemaType)
      };
      return (0, w.eachItem)(j, S.type.length === 0 ? (R) => CA.call(this, R, S) : (R) => S.type.forEach((aA) => CA.call(this, R, S, aA))), this;
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
        const S = j.rules.findIndex((R) => R.keyword === T);
        S >= 0 && j.rules.splice(S, 1);
      }
      return this;
    }
    // Add format
    addFormat(T, rA) {
      return typeof rA == "string" && (rA = new RegExp(rA)), this.formats[T] = rA, this;
    }
    errorsText(T = this.errors, { separator: rA = ", ", dataVar: j = "data" } = {}) {
      return !T || T.length === 0 ? "No errors" : T.map((S) => `${j}${S.instancePath} ${S.message}`).reduce((S, R) => S + rA + R);
    }
    $dataMetaSchema(T, rA) {
      const j = this.RULES.all;
      T = JSON.parse(JSON.stringify(T));
      for (const S of rA) {
        const R = S.split("/").slice(1);
        let aA = T;
        for (const bA of R)
          aA = aA[bA];
        for (const bA in j) {
          const _A = j[bA];
          if (typeof _A != "object")
            continue;
          const { $data: zA } = _A.definition, JA = aA[bA];
          zA && JA && (aA[bA] = HA(JA));
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
    _addSchema(T, rA, j, S = this.opts.validateSchema, R = this.opts.addUsedSchema) {
      let aA;
      const { schemaId: bA } = this.opts;
      if (typeof T == "object")
        aA = T[bA];
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
      const zA = c.getSchemaRefs.call(this, T, j);
      return _A = new l.SchemaEnv({ schema: T, schemaId: bA, meta: rA, baseId: j, localRefs: zA }), this._cache.set(_A.schema, _A), R && !j.startsWith("#") && (j && this._checkUnique(j), this.refs[j] = _A), S && this.validateSchema(T, !0), _A;
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
  E.ValidationError = n.default, E.MissingRefError = i.default, A.default = E;
  function M(uA, T, rA, j = "error") {
    for (const S in uA) {
      const R = S;
      R in T && this.logger[j](`${rA}: option ${S}. ${uA[R]}`);
    }
  }
  function K(uA) {
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
  const EA = /^[a-z_$][a-z0-9_$:-]*$/i;
  function q(uA, T) {
    const { RULES: rA } = this;
    if ((0, w.eachItem)(uA, (j) => {
      if (rA.keywords[j])
        throw new Error(`Keyword ${j} is already defined`);
      if (!EA.test(j))
        throw new Error(`Keyword ${j} has invalid name`);
    }), !!T && T.$data && !("code" in T || "validate" in T))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function CA(uA, T, rA) {
    var j;
    const S = T == null ? void 0 : T.post;
    if (rA && S)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: R } = this;
    let aA = S ? R.post : R.rules.find(({ type: _A }) => _A === rA);
    if (aA || (aA = { type: rA, rules: [] }, R.rules.push(aA)), R.keywords[uA] = !0, !T)
      return;
    const bA = {
      keyword: uA,
      definition: {
        ...T,
        type: (0, h.getJSONTypes)(T.type),
        schemaType: (0, h.getJSONTypes)(T.schemaType)
      }
    };
    T.before ? iA.call(this, aA, bA, T.before) : aA.rules.push(bA), R.all[uA] = bA, (j = T.implements) === null || j === void 0 || j.forEach((_A) => this.addKeyword(_A));
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
})(Wm);
var $d = {}, Gd = {}, Vd = {};
Object.defineProperty(Vd, "__esModule", { value: !0 });
const U_ = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
Vd.default = U_;
var na = {};
Object.defineProperty(na, "__esModule", { value: !0 });
na.callRef = na.getValidate = void 0;
const b_ = oo, kB = me, zt = ve, Sa = lr, $B = jt, zu = RA, E_ = {
  keyword: "$ref",
  schemaType: "string",
  code(A) {
    const { gen: e, schema: t, it: n } = A, { baseId: i, schemaEnv: s, validateName: l, opts: f, self: c } = n, { root: h } = s;
    if ((t === "#" || t === "#/") && i === h.baseId)
      return B();
    const w = $B.resolveRef.call(c, h, i, t);
    if (w === void 0)
      throw new b_.default(n.opts.uriResolver, i, t);
    if (w instanceof $B.SchemaEnv)
      return p(w);
    return v(w);
    function B() {
      if (s === h)
        return Tl(A, l, s, s.$async);
      const o = e.scopeValue("root", { ref: h });
      return Tl(A, (0, zt._)`${o}.validate`, h, h.$async);
    }
    function p(o) {
      const C = mv(A, o);
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
function mv(A, e) {
  const { gen: t } = A;
  return e.validate ? t.scopeValue("validate", { ref: e.validate }) : (0, zt._)`${t.scopeValue("wrapper", { ref: e })}.validate`;
}
na.getValidate = mv;
function Tl(A, e, t, n) {
  const { gen: i, it: s } = A, { allErrors: l, schemaEnv: f, opts: c } = s, h = c.passContext ? Sa.default.this : zt.nil;
  n ? w() : B();
  function w() {
    if (!f.$async)
      throw new Error("async schema referenced by sync schema");
    const o = i.let("valid");
    i.try(() => {
      i.code((0, zt._)`await ${(0, kB.callValidateCode)(A, e, h)}`), v(e), l || i.assign(o, !0);
    }, (C) => {
      i.if((0, zt._)`!(${C} instanceof ${s.ValidationError})`, () => i.throw(C)), p(C), l || i.assign(o, !1);
    }), A.ok(o);
  }
  function B() {
    A.result((0, kB.callValidateCode)(A, e, h), () => v(e), () => p(e));
  }
  function p(o) {
    const C = (0, zt._)`${o}.errors`;
    i.assign(Sa.default.vErrors, (0, zt._)`${Sa.default.vErrors} === null ? ${C} : ${Sa.default.vErrors}.concat(${C})`), i.assign(Sa.default.errors, (0, zt._)`${Sa.default.vErrors}.length`);
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
na.callRef = Tl;
na.default = E_;
Object.defineProperty(Gd, "__esModule", { value: !0 });
const __ = Vd, x_ = na, I_ = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  __.default,
  x_.default
];
Gd.default = I_;
var Wd = {}, Xd = {};
Object.defineProperty(Xd, "__esModule", { value: !0 });
const Xl = ve, li = Xl.operators, ql = {
  maximum: { okStr: "<=", ok: li.LTE, fail: li.GT },
  minimum: { okStr: ">=", ok: li.GTE, fail: li.LT },
  exclusiveMaximum: { okStr: "<", ok: li.LT, fail: li.GTE },
  exclusiveMinimum: { okStr: ">", ok: li.GT, fail: li.LTE }
}, H_ = {
  message: ({ keyword: A, schemaCode: e }) => (0, Xl.str)`must be ${ql[A].okStr} ${e}`,
  params: ({ keyword: A, schemaCode: e }) => (0, Xl._)`{comparison: ${ql[A].okStr}, limit: ${e}}`
}, S_ = {
  keyword: Object.keys(ql),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: H_,
  code(A) {
    const { keyword: e, data: t, schemaCode: n } = A;
    A.fail$data((0, Xl._)`${t} ${ql[e].fail} ${n} || isNaN(${t})`);
  }
};
Xd.default = S_;
var qd = {};
Object.defineProperty(qd, "__esModule", { value: !0 });
const us = ve, L_ = {
  message: ({ schemaCode: A }) => (0, us.str)`must be multiple of ${A}`,
  params: ({ schemaCode: A }) => (0, us._)`{multipleOf: ${A}}`
}, T_ = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: L_,
  code(A) {
    const { gen: e, data: t, schemaCode: n, it: i } = A, s = i.opts.multipleOfPrecision, l = e.let("res"), f = s ? (0, us._)`Math.abs(Math.round(${l}) - ${l}) > 1e-${s}` : (0, us._)`${l} !== parseInt(${l})`;
    A.fail$data((0, us._)`(${n} === 0 || (${l} = ${t}/${n}, ${f}))`);
  }
};
qd.default = T_;
var zd = {}, Jd = {};
Object.defineProperty(Jd, "__esModule", { value: !0 });
function vv(A) {
  const e = A.length;
  let t = 0, n = 0, i;
  for (; n < e; )
    t++, i = A.charCodeAt(n++), i >= 55296 && i <= 56319 && n < e && (i = A.charCodeAt(n), (i & 64512) === 56320 && n++);
  return t;
}
Jd.default = vv;
vv.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(zd, "__esModule", { value: !0 });
const Xi = ve, D_ = RA, O_ = Jd, N_ = {
  message({ keyword: A, schemaCode: e }) {
    const t = A === "maxLength" ? "more" : "fewer";
    return (0, Xi.str)`must NOT have ${t} than ${e} characters`;
  },
  params: ({ schemaCode: A }) => (0, Xi._)`{limit: ${A}}`
}, M_ = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: N_,
  code(A) {
    const { keyword: e, data: t, schemaCode: n, it: i } = A, s = e === "maxLength" ? Xi.operators.GT : Xi.operators.LT, l = i.opts.unicode === !1 ? (0, Xi._)`${t}.length` : (0, Xi._)`${(0, D_.useFunc)(A.gen, O_.default)}(${t})`;
    A.fail$data((0, Xi._)`${l} ${s} ${n}`);
  }
};
zd.default = M_;
var jd = {};
Object.defineProperty(jd, "__esModule", { value: !0 });
const P_ = me, zl = ve, K_ = {
  message: ({ schemaCode: A }) => (0, zl.str)`must match pattern "${A}"`,
  params: ({ schemaCode: A }) => (0, zl._)`{pattern: ${A}}`
}, R_ = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: K_,
  code(A) {
    const { data: e, $data: t, schema: n, schemaCode: i, it: s } = A, l = s.opts.unicodeRegExp ? "u" : "", f = t ? (0, zl._)`(new RegExp(${i}, ${l}))` : (0, P_.usePattern)(A, n);
    A.fail$data((0, zl._)`!${f}.test(${e})`);
  }
};
jd.default = R_;
var Yd = {};
Object.defineProperty(Yd, "__esModule", { value: !0 });
const ls = ve, k_ = {
  message({ keyword: A, schemaCode: e }) {
    const t = A === "maxProperties" ? "more" : "fewer";
    return (0, ls.str)`must NOT have ${t} than ${e} properties`;
  },
  params: ({ schemaCode: A }) => (0, ls._)`{limit: ${A}}`
}, $_ = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: k_,
  code(A) {
    const { keyword: e, data: t, schemaCode: n } = A, i = e === "maxProperties" ? ls.operators.GT : ls.operators.LT;
    A.fail$data((0, ls._)`Object.keys(${t}).length ${i} ${n}`);
  }
};
Yd.default = $_;
var Zd = {};
Object.defineProperty(Zd, "__esModule", { value: !0 });
const Go = me, cs = ve, G_ = RA, V_ = {
  message: ({ params: { missingProperty: A } }) => (0, cs.str)`must have required property '${A}'`,
  params: ({ params: { missingProperty: A } }) => (0, cs._)`{missingProperty: ${A}}`
}, W_ = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: V_,
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
          (0, G_.checkStrictMode)(l, U, l.opts.strictRequired);
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
Zd.default = W_;
var Ap = {};
Object.defineProperty(Ap, "__esModule", { value: !0 });
const fs = ve, X_ = {
  message({ keyword: A, schemaCode: e }) {
    const t = A === "maxItems" ? "more" : "fewer";
    return (0, fs.str)`must NOT have ${t} than ${e} items`;
  },
  params: ({ schemaCode: A }) => (0, fs._)`{limit: ${A}}`
}, q_ = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: X_,
  code(A) {
    const { keyword: e, data: t, schemaCode: n } = A, i = e === "maxItems" ? fs.operators.GT : fs.operators.LT;
    A.fail$data((0, fs._)`${t}.length ${i} ${n}`);
  }
};
Ap.default = q_;
var ep = {}, Ds = {};
Object.defineProperty(Ds, "__esModule", { value: !0 });
const yv = rv;
yv.code = 'require("ajv/dist/runtime/equal").default';
Ds.default = yv;
Object.defineProperty(ep, "__esModule", { value: !0 });
const nh = lt, vt = ve, z_ = RA, J_ = Ds, j_ = {
  message: ({ params: { i: A, j: e } }) => (0, vt.str)`must NOT have duplicate items (items ## ${e} and ${A} are identical)`,
  params: ({ params: { i: A, j: e } }) => (0, vt._)`{i: ${A}, j: ${e}}`
}, Y_ = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: j_,
  code(A) {
    const { gen: e, data: t, $data: n, schema: i, parentSchema: s, schemaCode: l, it: f } = A;
    if (!n && !i)
      return;
    const c = e.let("valid"), h = s.items ? (0, nh.getSchemaTypes)(s.items) : [];
    A.block$data(c, w, (0, vt._)`${l} === false`), A.ok(c);
    function w() {
      const o = e.let("i", (0, vt._)`${t}.length`), C = e.let("j");
      A.setParams({ i: o, j: C }), e.assign(c, !0), e.if((0, vt._)`${o} > 1`, () => (B() ? p : v)(o, C));
    }
    function B() {
      return h.length > 0 && !h.some((o) => o === "object" || o === "array");
    }
    function p(o, C) {
      const F = e.name("item"), U = (0, nh.checkDataTypes)(h, F, f.opts.strictNumbers, nh.DataType.Wrong), H = e.const("indices", (0, vt._)`{}`);
      e.for((0, vt._)`;${o}--;`, () => {
        e.let(F, (0, vt._)`${t}[${o}]`), e.if(U, (0, vt._)`continue`), h.length > 1 && e.if((0, vt._)`typeof ${F} == "string"`, (0, vt._)`${F} += "_"`), e.if((0, vt._)`typeof ${H}[${F}] == "number"`, () => {
          e.assign(C, (0, vt._)`${H}[${F}]`), A.error(), e.assign(c, !1).break();
        }).code((0, vt._)`${H}[${F}] = ${o}`);
      });
    }
    function v(o, C) {
      const F = (0, z_.useFunc)(e, J_.default), U = e.name("outer");
      e.label(U).for((0, vt._)`;${o}--;`, () => e.for((0, vt._)`${C} = ${o}; ${C}--;`, () => e.if((0, vt._)`${F}(${t}[${o}], ${t}[${C}])`, () => {
        A.error(), e.assign(c, !1).break(U);
      })));
    }
  }
};
ep.default = Y_;
var tp = {};
Object.defineProperty(tp, "__esModule", { value: !0 });
const Rh = ve, Z_ = RA, Ax = Ds, ex = {
  message: "must be equal to constant",
  params: ({ schemaCode: A }) => (0, Rh._)`{allowedValue: ${A}}`
}, tx = {
  keyword: "const",
  $data: !0,
  error: ex,
  code(A) {
    const { gen: e, data: t, $data: n, schemaCode: i, schema: s } = A;
    n || s && typeof s == "object" ? A.fail$data((0, Rh._)`!${(0, Z_.useFunc)(e, Ax.default)}(${t}, ${i})`) : A.fail((0, Rh._)`${s} !== ${t}`);
  }
};
tp.default = tx;
var np = {};
Object.defineProperty(np, "__esModule", { value: !0 });
const Zo = ve, nx = RA, rx = Ds, ix = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: A }) => (0, Zo._)`{allowedValues: ${A}}`
}, ax = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: ix,
  code(A) {
    const { gen: e, data: t, $data: n, schema: i, schemaCode: s, it: l } = A;
    if (!n && i.length === 0)
      throw new Error("enum must have non-empty array");
    const f = i.length >= l.opts.loopEnum;
    let c;
    const h = () => c ?? (c = (0, nx.useFunc)(e, rx.default));
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
np.default = ax;
Object.defineProperty(Wd, "__esModule", { value: !0 });
const ox = Xd, sx = qd, ux = zd, lx = jd, cx = Yd, fx = Zd, hx = Ap, dx = ep, px = tp, gx = np, Bx = [
  // number
  ox.default,
  sx.default,
  // string
  ux.default,
  lx.default,
  // object
  cx.default,
  fx.default,
  // array
  hx.default,
  dx.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  px.default,
  gx.default
];
Wd.default = Bx;
var rp = {}, so = {};
Object.defineProperty(so, "__esModule", { value: !0 });
so.validateAdditionalItems = void 0;
const qi = ve, kh = RA, wx = {
  message: ({ params: { len: A } }) => (0, qi.str)`must NOT have more than ${A} items`,
  params: ({ params: { len: A } }) => (0, qi._)`{limit: ${A}}`
}, mx = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: wx,
  code(A) {
    const { parentSchema: e, it: t } = A, { items: n } = e;
    if (!Array.isArray(n)) {
      (0, kh.checkStrictMode)(t, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Cv(A, n);
  }
};
function Cv(A, e) {
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
so.validateAdditionalItems = Cv;
so.default = mx;
var ip = {}, uo = {};
Object.defineProperty(uo, "__esModule", { value: !0 });
uo.validateTuple = void 0;
const GB = ve, Dl = RA, vx = me, yx = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(A) {
    const { schema: e, it: t } = A;
    if (Array.isArray(e))
      return Qv(A, "additionalItems", e);
    t.items = !0, !(0, Dl.alwaysValidSchema)(t, e) && A.ok((0, vx.validateArray)(A));
  }
};
function Qv(A, e, t = A.schema) {
  const { gen: n, parentSchema: i, data: s, keyword: l, it: f } = A;
  w(i), f.opts.unevaluated && t.length && f.items !== !0 && (f.items = Dl.mergeEvaluated.items(n, t.length, f.items));
  const c = n.name("valid"), h = n.const("len", (0, GB._)`${s}.length`);
  t.forEach((B, p) => {
    (0, Dl.alwaysValidSchema)(f, B) || (n.if((0, GB._)`${h} > ${p}`, () => A.subschema({
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
uo.validateTuple = Qv;
uo.default = yx;
Object.defineProperty(ip, "__esModule", { value: !0 });
const Cx = uo, Qx = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (A) => (0, Cx.validateTuple)(A, "items")
};
ip.default = Qx;
var ap = {};
Object.defineProperty(ap, "__esModule", { value: !0 });
const VB = ve, Fx = RA, Ux = me, bx = so, Ex = {
  message: ({ params: { len: A } }) => (0, VB.str)`must NOT have more than ${A} items`,
  params: ({ params: { len: A } }) => (0, VB._)`{limit: ${A}}`
}, _x = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: Ex,
  code(A) {
    const { schema: e, parentSchema: t, it: n } = A, { prefixItems: i } = t;
    n.items = !0, !(0, Fx.alwaysValidSchema)(n, e) && (i ? (0, bx.validateAdditionalItems)(A, i) : A.ok((0, Ux.validateArray)(A)));
  }
};
ap.default = _x;
var op = {};
Object.defineProperty(op, "__esModule", { value: !0 });
const wn = ve, Ju = RA, xx = {
  message: ({ params: { min: A, max: e } }) => e === void 0 ? (0, wn.str)`must contain at least ${A} valid item(s)` : (0, wn.str)`must contain at least ${A} and no more than ${e} valid item(s)`,
  params: ({ params: { min: A, max: e } }) => e === void 0 ? (0, wn._)`{minContains: ${A}}` : (0, wn._)`{minContains: ${A}, maxContains: ${e}}`
}, Ix = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: xx,
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
op.default = Ix;
var Fv = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.validateSchemaDeps = A.validatePropertyDeps = A.error = void 0;
  const e = ve, t = RA, n = me;
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
})(Fv);
var sp = {};
Object.defineProperty(sp, "__esModule", { value: !0 });
const Uv = ve, Hx = RA, Sx = {
  message: "property name must be valid",
  params: ({ params: A }) => (0, Uv._)`{propertyName: ${A.propertyName}}`
}, Lx = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: Sx,
  code(A) {
    const { gen: e, schema: t, data: n, it: i } = A;
    if ((0, Hx.alwaysValidSchema)(i, t))
      return;
    const s = e.name("valid");
    e.forIn("key", n, (l) => {
      A.setParams({ propertyName: l }), A.subschema({
        keyword: "propertyNames",
        data: l,
        dataTypes: ["string"],
        propertyName: l,
        compositeRule: !0
      }, s), e.if((0, Uv.not)(s), () => {
        A.error(!0), i.allErrors || e.break();
      });
    }), A.ok(s);
  }
};
sp.default = Lx;
var Uc = {};
Object.defineProperty(Uc, "__esModule", { value: !0 });
const ju = me, Kn = ve, Tx = lr, Yu = RA, Dx = {
  message: "must NOT have additional properties",
  params: ({ params: A }) => (0, Kn._)`{additionalProperty: ${A.additionalProperty}}`
}, Ox = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: Dx,
  code(A) {
    const { gen: e, schema: t, parentSchema: n, data: i, errsCount: s, it: l } = A;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: f, opts: c } = l;
    if (l.props = !0, c.removeAdditional !== "all" && (0, Yu.alwaysValidSchema)(l, t))
      return;
    const h = (0, ju.allSchemaProperties)(n.properties), w = (0, ju.allSchemaProperties)(n.patternProperties);
    B(), A.ok((0, Kn._)`${s} === ${Tx.default.errors}`);
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
      } else h.length ? U = (0, Kn.or)(...h.map((H) => (0, Kn._)`${F} === ${H}`)) : U = Kn.nil;
      return w.length && (U = (0, Kn.or)(U, ...w.map((H) => (0, Kn._)`${(0, ju.usePattern)(A, H)}.test(${F})`))), (0, Kn.not)(U);
    }
    function v(F) {
      e.code((0, Kn._)`delete ${i}[${F}]`);
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
        c.removeAdditional === "failing" ? (C(F, U, !1), e.if((0, Kn.not)(U), () => {
          A.reset(), v(F);
        })) : (C(F, U), f || e.if((0, Kn.not)(U), () => e.break()));
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
Uc.default = Ox;
var up = {};
Object.defineProperty(up, "__esModule", { value: !0 });
const Nx = yc(), WB = me, rh = RA, XB = Uc, Mx = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(A) {
    const { gen: e, schema: t, parentSchema: n, data: i, it: s } = A;
    s.opts.removeAdditional === "all" && n.additionalProperties === void 0 && XB.default.code(new Nx.KeywordCxt(s, XB.default, "additionalProperties"));
    const l = (0, WB.allSchemaProperties)(t);
    for (const B of l)
      s.definedProperties.add(B);
    s.opts.unevaluated && l.length && s.props !== !0 && (s.props = rh.mergeEvaluated.props(e, (0, rh.toHash)(l), s.props));
    const f = l.filter((B) => !(0, rh.alwaysValidSchema)(s, t[B]));
    if (f.length === 0)
      return;
    const c = e.name("valid");
    for (const B of f)
      h(B) ? w(B) : (e.if((0, WB.propertyInData)(e, i, B, s.opts.ownProperties)), w(B), s.allErrors || e.else().var(c, !0), e.endIf()), A.it.definedProperties.add(B), A.ok(c);
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
up.default = Mx;
var lp = {};
Object.defineProperty(lp, "__esModule", { value: !0 });
const qB = me, Zu = ve, zB = RA, JB = RA, Px = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(A) {
    const { gen: e, schema: t, data: n, parentSchema: i, it: s } = A, { opts: l } = s, f = (0, qB.allSchemaProperties)(t), c = f.filter((C) => (0, zB.alwaysValidSchema)(s, t[C]));
    if (f.length === 0 || c.length === f.length && (!s.opts.unevaluated || s.props === !0))
      return;
    const h = l.strictSchema && !l.allowMatchingProperties && i.properties, w = e.name("valid");
    s.props !== !0 && !(s.props instanceof Zu.Name) && (s.props = (0, JB.evaluatedPropsToName)(e, s.props));
    const { props: B } = s;
    p();
    function p() {
      for (const C of f)
        h && v(C), s.allErrors ? o(C) : (e.var(w, !0), o(C), e.if(w));
    }
    function v(C) {
      for (const F in h)
        new RegExp(C).test(F) && (0, zB.checkStrictMode)(s, `property ${F} matches pattern ${C} (use allowMatchingProperties)`);
    }
    function o(C) {
      e.forIn("key", n, (F) => {
        e.if((0, Zu._)`${(0, qB.usePattern)(A, C)}.test(${F})`, () => {
          const U = c.includes(C);
          U || A.subschema({
            keyword: "patternProperties",
            schemaProp: C,
            dataProp: F,
            dataPropType: JB.Type.Str
          }, w), s.opts.unevaluated && B !== !0 ? e.assign((0, Zu._)`${B}[${F}]`, !0) : !U && !s.allErrors && e.if((0, Zu.not)(w), () => e.break());
        });
      });
    }
  }
};
lp.default = Px;
var cp = {};
Object.defineProperty(cp, "__esModule", { value: !0 });
const Kx = RA, Rx = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(A) {
    const { gen: e, schema: t, it: n } = A;
    if ((0, Kx.alwaysValidSchema)(n, t)) {
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
cp.default = Rx;
var fp = {};
Object.defineProperty(fp, "__esModule", { value: !0 });
const kx = me, $x = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: kx.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
fp.default = $x;
var hp = {};
Object.defineProperty(hp, "__esModule", { value: !0 });
const Ol = ve, Gx = RA, Vx = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: A }) => (0, Ol._)`{passingSchemas: ${A.passing}}`
}, Wx = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: Vx,
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
        (0, Gx.alwaysValidSchema)(i, w) ? e.var(c, !0) : p = A.subschema({
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
hp.default = Wx;
var dp = {};
Object.defineProperty(dp, "__esModule", { value: !0 });
const Xx = RA, qx = {
  keyword: "allOf",
  schemaType: "array",
  code(A) {
    const { gen: e, schema: t, it: n } = A;
    if (!Array.isArray(t))
      throw new Error("ajv implementation error");
    const i = e.name("valid");
    t.forEach((s, l) => {
      if ((0, Xx.alwaysValidSchema)(n, s))
        return;
      const f = A.subschema({ keyword: "allOf", schemaProp: l }, i);
      A.ok(i), A.mergeEvaluated(f);
    });
  }
};
dp.default = qx;
var pp = {};
Object.defineProperty(pp, "__esModule", { value: !0 });
const Jl = ve, bv = RA, zx = {
  message: ({ params: A }) => (0, Jl.str)`must match "${A.ifClause}" schema`,
  params: ({ params: A }) => (0, Jl._)`{failingKeyword: ${A.ifClause}}`
}, Jx = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: zx,
  code(A) {
    const { gen: e, parentSchema: t, it: n } = A;
    t.then === void 0 && t.else === void 0 && (0, bv.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const i = jB(n, "then"), s = jB(n, "else");
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
function jB(A, e) {
  const t = A.schema[e];
  return t !== void 0 && !(0, bv.alwaysValidSchema)(A, t);
}
pp.default = Jx;
var gp = {};
Object.defineProperty(gp, "__esModule", { value: !0 });
const jx = RA, Yx = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: A, parentSchema: e, it: t }) {
    e.if === void 0 && (0, jx.checkStrictMode)(t, `"${A}" without "if" is ignored`);
  }
};
gp.default = Yx;
Object.defineProperty(rp, "__esModule", { value: !0 });
const Zx = so, AI = ip, eI = uo, tI = ap, nI = op, rI = Fv, iI = sp, aI = Uc, oI = up, sI = lp, uI = cp, lI = fp, cI = hp, fI = dp, hI = pp, dI = gp;
function pI(A = !1) {
  const e = [
    // any
    uI.default,
    lI.default,
    cI.default,
    fI.default,
    hI.default,
    dI.default,
    // object
    iI.default,
    aI.default,
    rI.default,
    oI.default,
    sI.default
  ];
  return A ? e.push(AI.default, tI.default) : e.push(Zx.default, eI.default), e.push(nI.default), e;
}
rp.default = pI;
var Bp = {}, wp = {};
Object.defineProperty(wp, "__esModule", { value: !0 });
const rt = ve, gI = {
  message: ({ schemaCode: A }) => (0, rt.str)`must match format "${A}"`,
  params: ({ schemaCode: A }) => (0, rt._)`{format: ${A}}`
}, BI = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: gI,
  code(A, e) {
    const { gen: t, data: n, $data: i, schema: s, schemaCode: l, it: f } = A, { opts: c, errSchemaPath: h, schemaEnv: w, self: B } = f;
    if (!c.validateFormats)
      return;
    i ? p() : v();
    function p() {
      const o = t.scopeValue("formats", {
        ref: B.formats,
        code: c.code.formats
      }), C = t.const("fDef", (0, rt._)`${o}[${l}]`), F = t.let("fType"), U = t.let("format");
      t.if((0, rt._)`typeof ${C} == "object" && !(${C} instanceof RegExp)`, () => t.assign(F, (0, rt._)`${C}.type || "string"`).assign(U, (0, rt._)`${C}.validate`), () => t.assign(F, (0, rt._)`"string"`).assign(U, C)), A.fail$data((0, rt.or)(H(), D()));
      function H() {
        return c.strictSchema === !1 ? rt.nil : (0, rt._)`${l} && !${U}`;
      }
      function D() {
        const E = w.$async ? (0, rt._)`(${C}.async ? await ${U}(${n}) : ${U}(${n}))` : (0, rt._)`${U}(${n})`, M = (0, rt._)`(typeof ${U} == "function" ? ${E} : ${U}.test(${n}))`;
        return (0, rt._)`${U} && ${U} !== true && ${F} === ${e} && !${M}`;
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
      C === e && A.pass(E());
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
        const K = M instanceof RegExp ? (0, rt.regexpCode)(M) : c.code.formats ? (0, rt._)`${c.code.formats}${(0, rt.getProperty)(s)}` : void 0, J = t.scopeValue("formats", { key: s, ref: M, code: K });
        return typeof M == "object" && !(M instanceof RegExp) ? [M.type || "string", M.validate, (0, rt._)`${J}.validate`] : ["string", M, J];
      }
      function E() {
        if (typeof o == "object" && !(o instanceof RegExp) && o.async) {
          if (!w.$async)
            throw new Error("async format in sync schema");
          return (0, rt._)`await ${U}(${n})`;
        }
        return typeof F == "function" ? (0, rt._)`${U}(${n})` : (0, rt._)`${U}.test(${n})`;
      }
    }
  }
};
wp.default = BI;
Object.defineProperty(Bp, "__esModule", { value: !0 });
const wI = wp, mI = [wI.default];
Bp.default = mI;
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
Object.defineProperty($d, "__esModule", { value: !0 });
const vI = Gd, yI = Wd, CI = rp, QI = Bp, YB = Ya, FI = [
  vI.default,
  yI.default,
  (0, CI.default)(),
  QI.default,
  YB.metadataVocabulary,
  YB.contentVocabulary
];
$d.default = FI;
var mp = {}, bc = {};
Object.defineProperty(bc, "__esModule", { value: !0 });
bc.DiscrError = void 0;
var ZB;
(function(A) {
  A.Tag = "tag", A.Mapping = "mapping";
})(ZB || (bc.DiscrError = ZB = {}));
Object.defineProperty(mp, "__esModule", { value: !0 });
const Ka = ve, $h = bc, Aw = jt, UI = oo, bI = RA, EI = {
  message: ({ params: { discrError: A, tagName: e } }) => A === $h.DiscrError.Tag ? `tag "${e}" must be string` : `value of tag "${e}" must be in oneOf`,
  params: ({ params: { discrError: A, tag: e, tagName: t } }) => (0, Ka._)`{error: ${A}, tag: ${t}, tagValue: ${e}}`
}, _I = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: EI,
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
      for (let E = 0; E < l.length; E++) {
        let M = l[E];
        if (M != null && M.$ref && !(0, bI.schemaHasRulesButRef)(M, s.self.RULES)) {
          const J = M.$ref;
          if (M = Aw.resolveRef.call(s.self, s.schemaEnv.root, s.baseId, J), M instanceof Aw.SchemaEnv && (M = M.schema), M === void 0)
            throw new UI.default(s.opts.uriResolver, s.baseId, J);
        }
        const K = (v = M == null ? void 0 : M.properties) === null || v === void 0 ? void 0 : v[f];
        if (typeof K != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${f}"`);
        F = F && (C || U(M)), H(K, E);
      }
      if (!F)
        throw new Error(`discriminator: "${f}" must be required`);
      return o;
      function U({ required: E }) {
        return Array.isArray(E) && E.includes(f);
      }
      function H(E, M) {
        if (E.const)
          D(E.const, M);
        else if (E.enum)
          for (const K of E.enum)
            D(K, M);
        else
          throw new Error(`discriminator: "properties/${f}" must have "const" or "enum"`);
      }
      function D(E, M) {
        if (typeof E != "string" || E in o)
          throw new Error(`discriminator: "${f}" values must be unique strings`);
        o[E] = M;
      }
    }
  }
};
mp.default = _I;
const xI = "http://json-schema.org/draft-07/schema#", II = "http://json-schema.org/draft-07/schema#", HI = "Core schema meta-schema", SI = {
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
}, LI = [
  "object",
  "boolean"
], TI = {
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
}, DI = {
  $schema: xI,
  $id: II,
  title: HI,
  definitions: SI,
  type: LI,
  properties: TI,
  default: !0
};
(function(A, e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.MissingRefError = e.ValidationError = e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = e.Ajv = void 0;
  const t = Wm, n = $d, i = mp, s = DI, l = ["/properties"], f = "http://json-schema.org/draft-07/schema";
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
  var B = Ts;
  Object.defineProperty(e, "ValidationError", { enumerable: !0, get: function() {
    return B.default;
  } });
  var p = oo;
  Object.defineProperty(e, "MissingRefError", { enumerable: !0, get: function() {
    return p.default;
  } });
})(Dh, Dh.exports);
var OI = Dh.exports;
const Ev = /* @__PURE__ */ vc(OI), NI = "http://json-schema.org/draft-07/schema#", MI = "Generated schema for Root", PI = "object", KI = {
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
}, RI = [
  "genome"
], kI = {
  $schema: NI,
  title: MI,
  type: PI,
  properties: KI,
  required: RI
}, $I = new Ev(), ew = $I.compile(kI), GI = function() {
  var A = function(e) {
    var i;
    if (!ew(e))
      throw console.log("annotation json:", e), console.log("Invalid data:", ew.errors), new Error("Invalid data");
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
}, VI = "http://json-schema.org/draft-07/schema#", WI = "Generated schema for Root", XI = "object", qI = {
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
}, zI = [
  "chromosomes"
], JI = {
  $schema: VI,
  title: WI,
  type: XI,
  properties: qI,
  required: zI
}, jI = new Ev(), tw = jI.compile(JI), YI = function() {
  var A = function(e) {
    if (!tw(e))
      throw console.log("json:", e), console.log("Invalid data:", tw.errors), new Error("Invalid data");
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
}, ZI = function() {
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
      var l = YI();
      let f;
      if (s ? f = l.readBasemapFromRawJSON(n) : f = await l.readBasemap(n), i) {
        var c = GI();
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
    var t, n = "4.17.21", i = 200, s = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", l = "Expected a function", f = "Invalid `variable` option passed into `_.template`", c = "__lodash_hash_undefined__", h = 500, w = "__lodash_placeholder__", B = 1, p = 2, v = 4, o = 1, C = 2, F = 1, U = 2, H = 4, D = 8, E = 16, M = 32, K = 64, J = 128, hA = 256, cA = 512, wA = 30, QA = "...", OA = 800, EA = 16, q = 1, CA = 2, iA = 3, gA = 1 / 0, IA = 9007199254740991, HA = 17976931348623157e292, uA = NaN, T = 4294967295, rA = T - 1, j = T >>> 1, S = [
      ["ary", J],
      ["bind", F],
      ["bindKey", U],
      ["curry", D],
      ["curryRight", E],
      ["flip", cA],
      ["partial", M],
      ["partialRight", K],
      ["rearg", hA]
    ], R = "[object Arguments]", aA = "[object Array]", bA = "[object AsyncFunction]", _A = "[object Boolean]", zA = "[object Date]", JA = "[object DOMException]", X = "[object Error]", V = "[object Function]", k = "[object GeneratorFunction]", eA = "[object Map]", lA = "[object Number]", TA = "[object Null]", jA = "[object Object]", se = "[object Promise]", xe = "[object Proxy]", fe = "[object RegExp]", he = "[object Set]", Te = "[object String]", ce = "[object Symbol]", Dt = "[object Undefined]", Ft = "[object WeakMap]", Ot = "[object WeakSet]", Ut = "[object ArrayBuffer]", gt = "[object DataView]", un = "[object Float32Array]", dr = "[object Float64Array]", Qi = "[object Int8Array]", Gr = "[object Int16Array]", Vr = "[object Int32Array]", pA = "[object Uint8Array]", MA = "[object Uint8ClampedArray]", XA = "[object Uint16Array]", ye = "[object Uint32Array]", Ce = /\b__p \+= '';/g, at = /\b(__p \+=) '' \+/g, bt = /(__e\(.*?\)|\b__t\)) \+\n'';/g, Un = /&(?:amp|lt|gt|quot|#39);/g, Fi = /[&<>"']/g, bn = RegExp(Un.source), Ui = RegExp(Fi.source), Wr = /<%-([\s\S]+?)%>/g, ln = /<%([\s\S]+?)%>/g, bi = /<%=([\s\S]+?)%>/g, Xr = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, pr = /^\w*$/, $s = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, co = /[\\^$.*+?()[\]{}|]/g, gr = RegExp(co.source), sa = /^\s+/, Ei = /\s/, Gs = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, Vs = /\{\n\/\* \[wrapped with (.+)\] \*/, ua = /,? & /, Ws = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g, la = /[()=,{}\[\]\/\s]/, fo = /\\(\\)?/g, Xs = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, qn = /\w*$/, zn = /^[-+]0x[0-9a-f]+$/i, kc = /^0b[01]+$/i, ho = /^\[object .+?Constructor\]$/, po = /^0o[0-7]+$/i, $c = /^(?:0|[1-9]\d*)$/, Gc = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, ca = /($^)/, Vc = /['\n\r\u2028\u2029\\]/g, _i = "\\ud800-\\udfff", qs = "\\u0300-\\u036f", zs = "\\ufe20-\\ufe2f", Js = "\\u20d0-\\u20ff", go = qs + zs + Js, Bo = "\\u2700-\\u27bf", wo = "a-z\\xdf-\\xf6\\xf8-\\xff", js = "\\xac\\xb1\\xd7\\xf7", Et = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", qr = "\\u2000-\\u206f", fa = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", Ys = "A-Z\\xc0-\\xd6\\xd8-\\xde", Zs = "\\ufe0e\\ufe0f", mo = js + Et + qr + fa, zr = "['’]", Au = "[" + _i + "]", eu = "[" + mo + "]", ha = "[" + go + "]", Gt = "\\d+", Wc = "[" + Bo + "]", tu = "[" + wo + "]", Br = "[^" + _i + mo + Gt + Bo + wo + Ys + "]", da = "\\ud83c[\\udffb-\\udfff]", En = "(?:" + ha + "|" + da + ")", pa = "[^" + _i + "]", _n = "(?:\\ud83c[\\udde6-\\uddff]){2}", Jr = "[\\ud800-\\udbff][\\udc00-\\udfff]", jr = "[" + Ys + "]", nu = "\\u200d", ga = "(?:" + tu + "|" + Br + ")", wr = "(?:" + jr + "|" + Br + ")", ru = "(?:" + zr + "(?:d|ll|m|re|s|t|ve))?", Ba = "(?:" + zr + "(?:D|LL|M|RE|S|T|VE))?", wa = En + "?", iu = "[" + Zs + "]?", Xc = "(?:" + nu + "(?:" + [pa, _n, Jr].join("|") + ")" + iu + wa + ")*", au = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", qc = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", ou = iu + wa + Xc, zc = "(?:" + [Wc, _n, Jr].join("|") + ")" + ou, Jc = "(?:" + [pa + ha + "?", ha, _n, Jr, Au].join("|") + ")", su = RegExp(zr, "g"), uu = RegExp(ha, "g"), xi = RegExp(da + "(?=" + da + ")|" + Jc + ou, "g"), lu = RegExp([
      jr + "?" + tu + "+" + ru + "(?=" + [eu, jr, "$"].join("|") + ")",
      wr + "+" + Ba + "(?=" + [eu, jr + ga, "$"].join("|") + ")",
      jr + "?" + ga + "+" + ru,
      jr + "+" + Ba,
      qc,
      au,
      Gt,
      zc
    ].join("|"), "g"), vo = RegExp("[" + nu + _i + go + Zs + "]"), Yr = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/, cu = [
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
    ], fu = -1, Me = {};
    Me[un] = Me[dr] = Me[Qi] = Me[Gr] = Me[Vr] = Me[pA] = Me[MA] = Me[XA] = Me[ye] = !0, Me[R] = Me[aA] = Me[Ut] = Me[_A] = Me[gt] = Me[zA] = Me[X] = Me[V] = Me[eA] = Me[lA] = Me[jA] = Me[fe] = Me[he] = Me[Te] = Me[Ft] = !1;
    var Pe = {};
    Pe[R] = Pe[aA] = Pe[Ut] = Pe[gt] = Pe[_A] = Pe[zA] = Pe[un] = Pe[dr] = Pe[Qi] = Pe[Gr] = Pe[Vr] = Pe[eA] = Pe[lA] = Pe[jA] = Pe[fe] = Pe[he] = Pe[Te] = Pe[ce] = Pe[pA] = Pe[MA] = Pe[XA] = Pe[ye] = !0, Pe[X] = Pe[V] = Pe[Ft] = !1;
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
    }, ef = parseFloat, hu = parseInt, du = typeof Wi == "object" && Wi && Wi.Object === Object && Wi, tf = typeof self == "object" && self && self.Object === Object && self, Ye = du || tf || Function("return this")(), yo = e && !e.nodeType && e, cn = yo && !0 && A && !A.nodeType && A, Zr = cn && cn.exports === yo, Ii = Zr && du.process, Nt = function() {
      try {
        var AA = cn && cn.require && cn.require("util").types;
        return AA || Ii && Ii.binding && Ii.binding("util");
      } catch {
      }
    }(), Co = Nt && Nt.isArrayBuffer, ma = Nt && Nt.isDate, Qo = Nt && Nt.isMap, Fo = Nt && Nt.isRegExp, pu = Nt && Nt.isSet, gu = Nt && Nt.isTypedArray;
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
      for (var ie = -1, He = AA == null ? 0 : AA.length; ++ie < He; ) {
        var Ze = AA[ie];
        fA(PA, Ze, sA(Ze), AA);
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
    function b(AA, fA) {
      for (var sA = -1, PA = AA == null ? 0 : AA.length; ++sA < PA; )
        if (!fA(AA[sA], sA, AA))
          return !1;
      return !0;
    }
    function _(AA, fA) {
      for (var sA = -1, PA = AA == null ? 0 : AA.length, ie = 0, He = []; ++sA < PA; ) {
        var Ze = AA[sA];
        fA(Ze, sA, AA) && (He[ie++] = Ze);
      }
      return He;
    }
    function I(AA, fA) {
      var sA = AA == null ? 0 : AA.length;
      return !!sA && qe(AA, fA, 0) > -1;
    }
    function P(AA, fA, sA) {
      for (var PA = -1, ie = AA == null ? 0 : AA.length; ++PA < ie; )
        if (sA(fA, AA[PA]))
          return !0;
      return !1;
    }
    function z(AA, fA) {
      for (var sA = -1, PA = AA == null ? 0 : AA.length, ie = Array(PA); ++sA < PA; )
        ie[sA] = fA(AA[sA], sA, AA);
      return ie;
    }
    function Y(AA, fA) {
      for (var sA = -1, PA = fA.length, ie = AA.length; ++sA < PA; )
        AA[ie + sA] = fA[sA];
      return AA;
    }
    function nA(AA, fA, sA, PA) {
      var ie = -1, He = AA == null ? 0 : AA.length;
      for (PA && He && (sA = AA[++ie]); ++ie < He; )
        sA = fA(sA, AA[ie], ie, AA);
      return sA;
    }
    function FA(AA, fA, sA, PA) {
      var ie = AA == null ? 0 : AA.length;
      for (PA && ie && (sA = AA[--ie]); ie--; )
        sA = fA(sA, AA[ie], ie, AA);
      return sA;
    }
    function LA(AA, fA) {
      for (var sA = -1, PA = AA == null ? 0 : AA.length; ++sA < PA; )
        if (fA(AA[sA], sA, AA))
          return !0;
      return !1;
    }
    var UA = ue("length");
    function re(AA) {
      return AA.split("");
    }
    function ZA(AA) {
      return AA.match(Ws) || [];
    }
    function oe(AA, fA, sA) {
      var PA;
      return sA(AA, function(ie, He, Ze) {
        if (fA(ie, He, Ze))
          return PA = He, !1;
      }), PA;
    }
    function ft(AA, fA, sA, PA) {
      for (var ie = AA.length, He = sA + (PA ? 1 : -1); PA ? He-- : ++He < ie; )
        if (fA(AA[He], He, AA))
          return He;
      return -1;
    }
    function qe(AA, fA, sA) {
      return fA === fA ? Qa(AA, fA, sA) : ft(AA, kA, sA);
    }
    function Jn(AA, fA, sA, PA) {
      for (var ie = sA - 1, He = AA.length; ++ie < He; )
        if (PA(AA[ie], fA))
          return ie;
      return -1;
    }
    function kA(AA) {
      return AA !== AA;
    }
    function st(AA, fA) {
      var sA = AA == null ? 0 : AA.length;
      return sA ? _t(AA, fA) / sA : uA;
    }
    function ue(AA) {
      return function(fA) {
        return fA == null ? t : fA[AA];
      };
    }
    function We(AA) {
      return function(fA) {
        return AA == null ? t : AA[fA];
      };
    }
    function xn(AA, fA, sA, PA, ie) {
      return ie(AA, function(He, Ze, be) {
        sA = PA ? (PA = !1, He) : fA(sA, He, Ze, be);
      }), sA;
    }
    function va(AA, fA) {
      var sA = AA.length;
      for (AA.sort(fA); sA--; )
        AA[sA] = AA[sA].value;
      return AA;
    }
    function _t(AA, fA) {
      for (var sA, PA = -1, ie = AA.length; ++PA < ie; ) {
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
      return AA && AA.slice(0, vu(AA) + 1).replace(sa, "");
    }
    function Ke(AA) {
      return function(fA) {
        return AA(fA);
      };
    }
    function xt(AA, fA) {
      return z(fA, function(sA) {
        return AA[sA];
      });
    }
    function Hi(AA, fA) {
      return AA.has(fA);
    }
    function Sn(AA, fA) {
      for (var sA = -1, PA = AA.length; ++sA < PA && qe(fA, AA[sA], 0) > -1; )
        ;
      return sA;
    }
    function Uo(AA, fA) {
      for (var sA = AA.length; sA-- && qe(fA, AA[sA], 0) > -1; )
        ;
      return sA;
    }
    function mr(AA, fA) {
      for (var sA = AA.length, PA = 0; sA--; )
        AA[sA] === fA && ++PA;
      return PA;
    }
    var bo = We(jc), De = We(Yc);
    function vr(AA) {
      return "\\" + Af[AA];
    }
    function Bu(AA, fA) {
      return AA == null ? t : AA[fA];
    }
    function Yn(AA) {
      return vo.test(AA);
    }
    function nf(AA) {
      return Yr.test(AA);
    }
    function ya(AA) {
      for (var fA, sA = []; !(fA = AA.next()).done; )
        sA.push(fA.value);
      return sA;
    }
    function Eo(AA) {
      var fA = -1, sA = Array(AA.size);
      return AA.forEach(function(PA, ie) {
        sA[++fA] = [ie, PA];
      }), sA;
    }
    function wu(AA, fA) {
      return function(sA) {
        return AA(fA(sA));
      };
    }
    function Zn(AA, fA) {
      for (var sA = -1, PA = AA.length, ie = 0, He = []; ++sA < PA; ) {
        var Ze = AA[sA];
        (Ze === fA || Ze === w) && (AA[sA] = w, He[ie++] = sA);
      }
      return He;
    }
    function Ca(AA) {
      var fA = -1, sA = Array(AA.size);
      return AA.forEach(function(PA) {
        sA[++fA] = PA;
      }), sA;
    }
    function mu(AA) {
      var fA = -1, sA = Array(AA.size);
      return AA.forEach(function(PA) {
        sA[++fA] = [PA, PA];
      }), sA;
    }
    function Qa(AA, fA, sA) {
      for (var PA = sA - 1, ie = AA.length; ++PA < ie; )
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
    function Bt(AA) {
      return Yn(AA) ? Ln(AA) : re(AA);
    }
    function vu(AA) {
      for (var fA = AA.length; fA-- && Ei.test(AA.charAt(fA)); )
        ;
      return fA;
    }
    var _o = We(Zc);
    function af(AA) {
      for (var fA = xi.lastIndex = 0; xi.test(AA); )
        ++fA;
      return fA;
    }
    function Ln(AA) {
      return AA.match(xi) || [];
    }
    function Tn(AA) {
      return AA.match(lu) || [];
    }
    var yu = function AA(fA) {
      fA = fA == null ? Ye : Ie.defaults(Ye.Object(), fA, Ie.pick(Ye, cu));
      var sA = fA.Array, PA = fA.Date, ie = fA.Error, He = fA.Function, Ze = fA.Math, be = fA.Object, Si = fA.RegExp, Cu = fA.String, wt = fA.TypeError, ei = sA.prototype, xo = He.prototype, ti = be.prototype, yr = fA["__core-js_shared__"], ni = xo.toString, Se = ti.hasOwnProperty, of = 0, N = function() {
        var r = /[^.]+$/.exec(yr && yr.keys && yr.keys.IE_PROTO || "");
        return r ? "Symbol(src)_1." + r : "";
      }(), G = ti.toString, Z = ni.call(be), dA = Ye._, oA = Si(
        "^" + ni.call(Se).replace(co, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
      ), yA = Zr ? fA.Buffer : t, BA = fA.Symbol, SA = fA.Uint8Array, GA = yA ? yA.allocUnsafe : t, ne = wu(be.getPrototypeOf, be), VA = be.create, Ae = ti.propertyIsEnumerable, de = ei.splice, Le = BA ? BA.isConcatSpreadable : t, qA = BA ? BA.iterator : t, ke = BA ? BA.toStringTag : t, At = function() {
        try {
          var r = Mi(be, "defineProperty");
          return r({}, "", {}), r;
        } catch {
        }
      }(), Mt = fA.clearTimeout !== Ye.clearTimeout && fA.clearTimeout, Ge = PA && PA.now !== Ye.Date.now && PA.now, Li = fA.setTimeout !== Ye.setTimeout && fA.setTimeout, Ar = Ze.ceil, ht = Ze.floor, sf = be.getOwnPropertySymbols, Ly = yA ? yA.isBuffer : t, Wp = fA.isFinite, Ty = ei.join, Dy = wu(be.keys, be), ut = Ze.max, It = Ze.min, Oy = PA.now, Ny = fA.parseInt, Xp = Ze.random, My = ei.reverse, uf = Mi(fA, "DataView"), Io = Mi(fA, "Map"), lf = Mi(fA, "Promise"), Fa = Mi(fA, "Set"), Ho = Mi(fA, "WeakMap"), So = Mi(be, "create"), Qu = Ho && new Ho(), Ua = {}, Py = Pi(uf), Ky = Pi(Io), Ry = Pi(lf), ky = Pi(Fa), $y = Pi(Ho), Fu = BA ? BA.prototype : t, Lo = Fu ? Fu.valueOf : t, qp = Fu ? Fu.toString : t;
      function L(r) {
        if (je(r) && !le(r) && !(r instanceof Fe)) {
          if (r instanceof fn)
            return r;
          if (Se.call(r, "__wrapped__"))
            return zg(r);
        }
        return new fn(r);
      }
      var ba = /* @__PURE__ */ function() {
        function r() {
        }
        return function(a) {
          if (!Je(a))
            return {};
          if (VA)
            return VA(a);
          r.prototype = a;
          var g = new r();
          return r.prototype = t, g;
        };
      }();
      function Uu() {
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
          _: L
        }
      }, L.prototype = Uu.prototype, L.prototype.constructor = L, fn.prototype = ba(Uu.prototype), fn.prototype.constructor = fn;
      function Fe(r) {
        this.__wrapped__ = r, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = !1, this.__iteratees__ = [], this.__takeCount__ = T, this.__views__ = [];
      }
      function Gy() {
        var r = new Fe(this.__wrapped__);
        return r.__actions__ = Vt(this.__actions__), r.__dir__ = this.__dir__, r.__filtered__ = this.__filtered__, r.__iteratees__ = Vt(this.__iteratees__), r.__takeCount__ = this.__takeCount__, r.__views__ = Vt(this.__views__), r;
      }
      function Vy() {
        if (this.__filtered__) {
          var r = new Fe(this);
          r.__dir__ = -1, r.__filtered__ = !0;
        } else
          r = this.clone(), r.__dir__ *= -1;
        return r;
      }
      function Wy() {
        var r = this.__wrapped__.value(), a = this.__dir__, g = le(r), Q = a < 0, x = g ? r.length : 0, O = rQ(0, x, this.__views__), $ = O.start, W = O.end, tA = W - $, mA = Q ? W : $ - 1, vA = this.__iteratees__, xA = vA.length, DA = 0, $A = It(tA, this.__takeCount__);
        if (!g || !Q && x == tA && $A == tA)
          return wg(r, this.__actions__);
        var ee = [];
        A:
          for (; tA-- && DA < $A; ) {
            mA += a;
            for (var Be = -1, te = r[mA]; ++Be < xA; ) {
              var Qe = vA[Be], Ee = Qe.iteratee, nn = Qe.type, Rt = Ee(te);
              if (nn == CA)
                te = Rt;
              else if (!Rt) {
                if (nn == q)
                  continue A;
                break A;
              }
            }
            ee[DA++] = te;
          }
        return ee;
      }
      Fe.prototype = ba(Uu.prototype), Fe.prototype.constructor = Fe;
      function Ti(r) {
        var a = -1, g = r == null ? 0 : r.length;
        for (this.clear(); ++a < g; ) {
          var Q = r[a];
          this.set(Q[0], Q[1]);
        }
      }
      function Xy() {
        this.__data__ = So ? So(null) : {}, this.size = 0;
      }
      function qy(r) {
        var a = this.has(r) && delete this.__data__[r];
        return this.size -= a ? 1 : 0, a;
      }
      function zy(r) {
        var a = this.__data__;
        if (So) {
          var g = a[r];
          return g === c ? t : g;
        }
        return Se.call(a, r) ? a[r] : t;
      }
      function Jy(r) {
        var a = this.__data__;
        return So ? a[r] !== t : Se.call(a, r);
      }
      function jy(r, a) {
        var g = this.__data__;
        return this.size += this.has(r) ? 0 : 1, g[r] = So && a === t ? c : a, this;
      }
      Ti.prototype.clear = Xy, Ti.prototype.delete = qy, Ti.prototype.get = zy, Ti.prototype.has = Jy, Ti.prototype.set = jy;
      function Cr(r) {
        var a = -1, g = r == null ? 0 : r.length;
        for (this.clear(); ++a < g; ) {
          var Q = r[a];
          this.set(Q[0], Q[1]);
        }
      }
      function Yy() {
        this.__data__ = [], this.size = 0;
      }
      function Zy(r) {
        var a = this.__data__, g = bu(a, r);
        if (g < 0)
          return !1;
        var Q = a.length - 1;
        return g == Q ? a.pop() : de.call(a, g, 1), --this.size, !0;
      }
      function AC(r) {
        var a = this.__data__, g = bu(a, r);
        return g < 0 ? t : a[g][1];
      }
      function eC(r) {
        return bu(this.__data__, r) > -1;
      }
      function tC(r, a) {
        var g = this.__data__, Q = bu(g, r);
        return Q < 0 ? (++this.size, g.push([r, a])) : g[Q][1] = a, this;
      }
      Cr.prototype.clear = Yy, Cr.prototype.delete = Zy, Cr.prototype.get = AC, Cr.prototype.has = eC, Cr.prototype.set = tC;
      function Qr(r) {
        var a = -1, g = r == null ? 0 : r.length;
        for (this.clear(); ++a < g; ) {
          var Q = r[a];
          this.set(Q[0], Q[1]);
        }
      }
      function nC() {
        this.size = 0, this.__data__ = {
          hash: new Ti(),
          map: new (Io || Cr)(),
          string: new Ti()
        };
      }
      function rC(r) {
        var a = Mu(this, r).delete(r);
        return this.size -= a ? 1 : 0, a;
      }
      function iC(r) {
        return Mu(this, r).get(r);
      }
      function aC(r) {
        return Mu(this, r).has(r);
      }
      function oC(r, a) {
        var g = Mu(this, r), Q = g.size;
        return g.set(r, a), this.size += g.size == Q ? 0 : 1, this;
      }
      Qr.prototype.clear = nC, Qr.prototype.delete = rC, Qr.prototype.get = iC, Qr.prototype.has = aC, Qr.prototype.set = oC;
      function Di(r) {
        var a = -1, g = r == null ? 0 : r.length;
        for (this.__data__ = new Qr(); ++a < g; )
          this.add(r[a]);
      }
      function sC(r) {
        return this.__data__.set(r, c), this;
      }
      function uC(r) {
        return this.__data__.has(r);
      }
      Di.prototype.add = Di.prototype.push = sC, Di.prototype.has = uC;
      function Dn(r) {
        var a = this.__data__ = new Cr(r);
        this.size = a.size;
      }
      function lC() {
        this.__data__ = new Cr(), this.size = 0;
      }
      function cC(r) {
        var a = this.__data__, g = a.delete(r);
        return this.size = a.size, g;
      }
      function fC(r) {
        return this.__data__.get(r);
      }
      function hC(r) {
        return this.__data__.has(r);
      }
      function dC(r, a) {
        var g = this.__data__;
        if (g instanceof Cr) {
          var Q = g.__data__;
          if (!Io || Q.length < i - 1)
            return Q.push([r, a]), this.size = ++g.size, this;
          g = this.__data__ = new Qr(Q);
        }
        return g.set(r, a), this.size = g.size, this;
      }
      Dn.prototype.clear = lC, Dn.prototype.delete = cC, Dn.prototype.get = fC, Dn.prototype.has = hC, Dn.prototype.set = dC;
      function zp(r, a) {
        var g = le(r), Q = !g && Ki(r), x = !g && !Q && si(r), O = !g && !Q && !x && Ia(r), $ = g || Q || x || O, W = $ ? In(r.length, Cu) : [], tA = W.length;
        for (var mA in r)
          (a || Se.call(r, mA)) && !($ && // Safari 9 has enumerable `arguments.length` in strict mode.
          (mA == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
          x && (mA == "offset" || mA == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
          O && (mA == "buffer" || mA == "byteLength" || mA == "byteOffset") || // Skip index properties.
          Er(mA, tA))) && W.push(mA);
        return W;
      }
      function Jp(r) {
        var a = r.length;
        return a ? r[yf(0, a - 1)] : t;
      }
      function pC(r, a) {
        return Pu(Vt(r), Oi(a, 0, r.length));
      }
      function gC(r) {
        return Pu(Vt(r));
      }
      function cf(r, a, g) {
        (g !== t && !On(r[a], g) || g === t && !(a in r)) && Fr(r, a, g);
      }
      function To(r, a, g) {
        var Q = r[a];
        (!(Se.call(r, a) && On(Q, g)) || g === t && !(a in r)) && Fr(r, a, g);
      }
      function bu(r, a) {
        for (var g = r.length; g--; )
          if (On(r[g][0], a))
            return g;
        return -1;
      }
      function BC(r, a, g, Q) {
        return ri(r, function(x, O, $) {
          a(Q, x, g(x), $);
        }), Q;
      }
      function jp(r, a) {
        return r && tr(a, dt(a), r);
      }
      function wC(r, a) {
        return r && tr(a, Xt(a), r);
      }
      function Fr(r, a, g) {
        a == "__proto__" && At ? At(r, a, {
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
        if (!Je(r))
          return r;
        var vA = le(r);
        if (vA) {
          if ($ = aQ(r), !W)
            return Vt(r, $);
        } else {
          var xA = Ht(r), DA = xA == V || xA == k;
          if (si(r))
            return yg(r, W);
          if (xA == jA || xA == R || DA && !x) {
            if ($ = tA || DA ? {} : Kg(r), !W)
              return tA ? zC(r, wC($, r)) : qC(r, jp($, r));
          } else {
            if (!Pe[xA])
              return x ? r : {};
            $ = oQ(r, xA, W);
          }
        }
        O || (O = new Dn());
        var $A = O.get(r);
        if ($A)
          return $A;
        O.set(r, $), pB(r) ? r.forEach(function(te) {
          $.add(hn(te, a, g, te, r, O));
        }) : hB(r) && r.forEach(function(te, Qe) {
          $.set(Qe, hn(te, a, g, Qe, r, O));
        });
        var ee = mA ? tA ? Sf : Hf : tA ? Xt : dt, Be = vA ? t : ee(r);
        return m(Be || r, function(te, Qe) {
          Be && (Qe = te, te = r[Qe]), To($, Qe, hn(te, a, g, Qe, r, O));
        }), $;
      }
      function mC(r) {
        var a = dt(r);
        return function(g) {
          return Yp(g, r, a);
        };
      }
      function Yp(r, a, g) {
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
      function Zp(r, a, g) {
        if (typeof r != "function")
          throw new wt(l);
        return Ro(function() {
          r.apply(t, g);
        }, a);
      }
      function Do(r, a, g, Q) {
        var x = -1, O = I, $ = !0, W = r.length, tA = [], mA = a.length;
        if (!W)
          return tA;
        g && (a = z(a, Ke(g))), Q ? (O = P, $ = !1) : a.length >= i && (O = Hi, $ = !1, a = new Di(a));
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
      var ri = bg(er), Ag = bg(df, !0);
      function vC(r, a) {
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
      function yC(r, a, g, Q) {
        var x = r.length;
        for (g = pe(g), g < 0 && (g = -g > x ? 0 : x + g), Q = Q === t || Q > x ? x : pe(Q), Q < 0 && (Q += x), Q = g > Q ? 0 : BB(Q); g < Q; )
          r[g++] = a;
        return r;
      }
      function eg(r, a) {
        var g = [];
        return ri(r, function(Q, x, O) {
          a(Q, x, O) && g.push(Q);
        }), g;
      }
      function mt(r, a, g, Q, x) {
        var O = -1, $ = r.length;
        for (g || (g = uQ), x || (x = []); ++O < $; ) {
          var W = r[O];
          a > 0 && g(W) ? a > 1 ? mt(W, a - 1, g, Q, x) : Y(x, W) : Q || (x[x.length] = W);
        }
        return x;
      }
      var hf = Eg(), tg = Eg(!0);
      function er(r, a) {
        return r && hf(r, a, dt);
      }
      function df(r, a) {
        return r && tg(r, a, dt);
      }
      function _u(r, a) {
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
      function ng(r, a, g) {
        var Q = a(r);
        return le(r) ? Q : Y(Q, g(r));
      }
      function Pt(r) {
        return r == null ? r === t ? Dt : TA : ke && ke in be(r) ? nQ(r) : gQ(r);
      }
      function pf(r, a) {
        return r > a;
      }
      function CC(r, a) {
        return r != null && Se.call(r, a);
      }
      function QC(r, a) {
        return r != null && a in be(r);
      }
      function FC(r, a, g) {
        return r >= It(a, g) && r < ut(a, g);
      }
      function gf(r, a, g) {
        for (var Q = g ? P : I, x = r[0].length, O = r.length, $ = O, W = sA(O), tA = 1 / 0, mA = []; $--; ) {
          var vA = r[$];
          $ && a && (vA = z(vA, Ke(a))), tA = It(vA.length, tA), W[$] = !g && (a || x >= 120 && vA.length >= 120) ? new Di($ && vA) : t;
        }
        vA = r[0];
        var xA = -1, DA = W[0];
        A:
          for (; ++xA < x && mA.length < tA; ) {
            var $A = vA[xA], ee = a ? a($A) : $A;
            if ($A = g || $A !== 0 ? $A : 0, !(DA ? Hi(DA, ee) : Q(mA, ee, g))) {
              for ($ = O; --$; ) {
                var Be = W[$];
                if (!(Be ? Hi(Be, ee) : Q(r[$], ee, g)))
                  continue A;
              }
              DA && DA.push(ee), mA.push($A);
            }
          }
        return mA;
      }
      function UC(r, a, g, Q) {
        return er(r, function(x, O, $) {
          a(Q, g(x), O, $);
        }), Q;
      }
      function Oo(r, a, g) {
        a = ai(a, r), r = Gg(r, a);
        var Q = r == null ? r : r[nr(pn(a))];
        return Q == null ? t : u(Q, r, g);
      }
      function rg(r) {
        return je(r) && Pt(r) == R;
      }
      function bC(r) {
        return je(r) && Pt(r) == Ut;
      }
      function EC(r) {
        return je(r) && Pt(r) == zA;
      }
      function No(r, a, g, Q, x) {
        return r === a ? !0 : r == null || a == null || !je(r) && !je(a) ? r !== r && a !== a : _C(r, a, g, Q, No, x);
      }
      function _C(r, a, g, Q, x, O) {
        var $ = le(r), W = le(a), tA = $ ? aA : Ht(r), mA = W ? aA : Ht(a);
        tA = tA == R ? jA : tA, mA = mA == R ? jA : mA;
        var vA = tA == jA, xA = mA == jA, DA = tA == mA;
        if (DA && si(r)) {
          if (!si(a))
            return !1;
          $ = !0, vA = !1;
        }
        if (DA && !vA)
          return O || (O = new Dn()), $ || Ia(r) ? Ng(r, a, g, Q, x, O) : eQ(r, a, tA, g, Q, x, O);
        if (!(g & o)) {
          var $A = vA && Se.call(r, "__wrapped__"), ee = xA && Se.call(a, "__wrapped__");
          if ($A || ee) {
            var Be = $A ? r.value() : r, te = ee ? a.value() : a;
            return O || (O = new Dn()), x(Be, te, g, Q, O);
          }
        }
        return DA ? (O || (O = new Dn()), tQ(r, a, g, Q, x, O)) : !1;
      }
      function xC(r) {
        return je(r) && Ht(r) == eA;
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
      function ig(r) {
        if (!Je(r) || cQ(r))
          return !1;
        var a = _r(r) ? oA : ho;
        return a.test(Pi(r));
      }
      function IC(r) {
        return je(r) && Pt(r) == fe;
      }
      function HC(r) {
        return je(r) && Ht(r) == he;
      }
      function SC(r) {
        return je(r) && Vu(r.length) && !!Me[Pt(r)];
      }
      function ag(r) {
        return typeof r == "function" ? r : r == null ? qt : typeof r == "object" ? le(r) ? ug(r[0], r[1]) : sg(r) : _B(r);
      }
      function wf(r) {
        if (!Ko(r))
          return Dy(r);
        var a = [];
        for (var g in be(r))
          Se.call(r, g) && g != "constructor" && a.push(g);
        return a;
      }
      function LC(r) {
        if (!Je(r))
          return pQ(r);
        var a = Ko(r), g = [];
        for (var Q in r)
          Q == "constructor" && (a || !Se.call(r, Q)) || g.push(Q);
        return g;
      }
      function mf(r, a) {
        return r < a;
      }
      function og(r, a) {
        var g = -1, Q = Wt(r) ? sA(r.length) : [];
        return ri(r, function(x, O, $) {
          Q[++g] = a(x, O, $);
        }), Q;
      }
      function sg(r) {
        var a = Tf(r);
        return a.length == 1 && a[0][2] ? kg(a[0][0], a[0][1]) : function(g) {
          return g === r || Bf(g, r, a);
        };
      }
      function ug(r, a) {
        return Of(r) && Rg(a) ? kg(nr(r), a) : function(g) {
          var Q = Wf(g, r);
          return Q === t && Q === a ? Xf(g, r) : No(a, Q, o | C);
        };
      }
      function xu(r, a, g, Q, x) {
        r !== a && hf(a, function(O, $) {
          if (x || (x = new Dn()), Je(O))
            TC(r, a, $, g, xu, Q, x);
          else {
            var W = Q ? Q(Mf(r, $), O, $ + "", r, a, x) : t;
            W === t && (W = O), cf(r, $, W);
          }
        }, Xt);
      }
      function TC(r, a, g, Q, x, O, $) {
        var W = Mf(r, g), tA = Mf(a, g), mA = $.get(tA);
        if (mA) {
          cf(r, g, mA);
          return;
        }
        var vA = O ? O(W, tA, g + "", r, a, $) : t, xA = vA === t;
        if (xA) {
          var DA = le(tA), $A = !DA && si(tA), ee = !DA && !$A && Ia(tA);
          vA = tA, DA || $A || ee ? le(W) ? vA = W : et(W) ? vA = Vt(W) : $A ? (xA = !1, vA = yg(tA, !0)) : ee ? (xA = !1, vA = Cg(tA, !0)) : vA = [] : ko(tA) || Ki(tA) ? (vA = W, Ki(W) ? vA = wB(W) : (!Je(W) || _r(W)) && (vA = Kg(tA))) : xA = !1;
        }
        xA && ($.set(tA, vA), x(vA, tA, Q, O, $), $.delete(tA)), cf(r, g, vA);
      }
      function lg(r, a) {
        var g = r.length;
        if (g)
          return a += a < 0 ? g : 0, Er(a, g) ? r[a] : t;
      }
      function cg(r, a, g) {
        a.length ? a = z(a, function(O) {
          return le(O) ? function($) {
            return Ni($, O.length === 1 ? O[0] : O);
          } : O;
        }) : a = [qt];
        var Q = -1;
        a = z(a, Ke(YA()));
        var x = og(r, function(O, $, W) {
          var tA = z(a, function(mA) {
            return mA(O);
          });
          return { criteria: tA, index: ++Q, value: O };
        });
        return va(x, function(O, $) {
          return XC(O, $, g);
        });
      }
      function DC(r, a) {
        return fg(r, a, function(g, Q) {
          return Xf(r, Q);
        });
      }
      function fg(r, a, g) {
        for (var Q = -1, x = a.length, O = {}; ++Q < x; ) {
          var $ = a[Q], W = Ni(r, $);
          g(W, $) && Mo(O, ai($, r), W);
        }
        return O;
      }
      function OC(r) {
        return function(a) {
          return Ni(a, r);
        };
      }
      function vf(r, a, g, Q) {
        var x = Q ? Jn : qe, O = -1, $ = a.length, W = r;
        for (r === a && (a = Vt(a)), g && (W = z(r, Ke(g))); ++O < $; )
          for (var tA = 0, mA = a[O], vA = g ? g(mA) : mA; (tA = x(W, vA, tA, Q)) > -1; )
            W !== r && de.call(W, tA, 1), de.call(r, tA, 1);
        return r;
      }
      function hg(r, a) {
        for (var g = r ? a.length : 0, Q = g - 1; g--; ) {
          var x = a[g];
          if (g == Q || x !== O) {
            var O = x;
            Er(x) ? de.call(r, x, 1) : Ff(r, x);
          }
        }
        return r;
      }
      function yf(r, a) {
        return r + ht(Xp() * (a - r + 1));
      }
      function NC(r, a, g, Q) {
        for (var x = -1, O = ut(Ar((a - r) / (g || 1)), 0), $ = sA(O); O--; )
          $[Q ? O : ++x] = r, r += g;
        return $;
      }
      function Cf(r, a) {
        var g = "";
        if (!r || a < 1 || a > IA)
          return g;
        do
          a % 2 && (g += r), a = ht(a / 2), a && (r += r);
        while (a);
        return g;
      }
      function we(r, a) {
        return Pf($g(r, a, qt), r + "");
      }
      function MC(r) {
        return Jp(Ha(r));
      }
      function PC(r, a) {
        var g = Ha(r);
        return Pu(g, Oi(a, 0, g.length));
      }
      function Mo(r, a, g, Q) {
        if (!Je(r))
          return r;
        a = ai(a, r);
        for (var x = -1, O = a.length, $ = O - 1, W = r; W != null && ++x < O; ) {
          var tA = nr(a[x]), mA = g;
          if (tA === "__proto__" || tA === "constructor" || tA === "prototype")
            return r;
          if (x != $) {
            var vA = W[tA];
            mA = Q ? Q(vA, tA, W) : t, mA === t && (mA = Je(vA) ? vA : Er(a[x + 1]) ? [] : {});
          }
          To(W, tA, mA), W = W[tA];
        }
        return r;
      }
      var dg = Qu ? function(r, a) {
        return Qu.set(r, a), r;
      } : qt, KC = At ? function(r, a) {
        return At(r, "toString", {
          configurable: !0,
          enumerable: !1,
          value: zf(a),
          writable: !0
        });
      } : qt;
      function RC(r) {
        return Pu(Ha(r));
      }
      function dn(r, a, g) {
        var Q = -1, x = r.length;
        a < 0 && (a = -a > x ? 0 : x + a), g = g > x ? x : g, g < 0 && (g += x), x = a > g ? 0 : g - a >>> 0, a >>>= 0;
        for (var O = sA(x); ++Q < x; )
          O[Q] = r[Q + a];
        return O;
      }
      function kC(r, a) {
        var g;
        return ri(r, function(Q, x, O) {
          return g = a(Q, x, O), !g;
        }), !!g;
      }
      function Iu(r, a, g) {
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
          var vA = ht((x + O) / 2), xA = g(r[vA]), DA = xA !== t, $A = xA === null, ee = xA === xA, Be = tn(xA);
          if ($)
            var te = Q || ee;
          else mA ? te = ee && (Q || DA) : W ? te = ee && DA && (Q || !$A) : tA ? te = ee && DA && !$A && (Q || !Be) : $A || Be ? te = !1 : te = Q ? xA <= a : xA < a;
          te ? x = vA + 1 : O = vA;
        }
        return It(O, rA);
      }
      function pg(r, a) {
        for (var g = -1, Q = r.length, x = 0, O = []; ++g < Q; ) {
          var $ = r[g], W = a ? a($) : $;
          if (!g || !On(W, tA)) {
            var tA = W;
            O[x++] = $ === 0 ? 0 : $;
          }
        }
        return O;
      }
      function gg(r) {
        return typeof r == "number" ? r : tn(r) ? uA : +r;
      }
      function en(r) {
        if (typeof r == "string")
          return r;
        if (le(r))
          return z(r, en) + "";
        if (tn(r))
          return qp ? qp.call(r) : "";
        var a = r + "";
        return a == "0" && 1 / r == -gA ? "-0" : a;
      }
      function ii(r, a, g) {
        var Q = -1, x = I, O = r.length, $ = !0, W = [], tA = W;
        if (g)
          $ = !1, x = P;
        else if (O >= i) {
          var mA = a ? null : ZC(r);
          if (mA)
            return Ca(mA);
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
        return a = ai(a, r), r = Gg(r, a), r == null || delete r[nr(pn(a))];
      }
      function Bg(r, a, g, Q) {
        return Mo(r, a, g(Ni(r, a)), Q);
      }
      function Hu(r, a, g, Q) {
        for (var x = r.length, O = Q ? x : -1; (Q ? O-- : ++O < x) && a(r[O], O, r); )
          ;
        return g ? dn(r, Q ? 0 : O, Q ? O + 1 : x) : dn(r, Q ? O + 1 : 0, Q ? x : O);
      }
      function wg(r, a) {
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
        return ii(mt(O, 1), a, g);
      }
      function mg(r, a, g) {
        for (var Q = -1, x = r.length, O = a.length, $ = {}; ++Q < x; ) {
          var W = Q < O ? a[Q] : t;
          g($, r[Q], W);
        }
        return $;
      }
      function bf(r) {
        return et(r) ? r : [];
      }
      function Ef(r) {
        return typeof r == "function" ? r : qt;
      }
      function ai(r, a) {
        return le(r) ? r : Of(r, a) ? [r] : qg(Oe(r));
      }
      var $C = we;
      function oi(r, a, g) {
        var Q = r.length;
        return g = g === t ? Q : g, !a && g >= Q ? r : dn(r, a, g);
      }
      var vg = Mt || function(r) {
        return Ye.clearTimeout(r);
      };
      function yg(r, a) {
        if (a)
          return r.slice();
        var g = r.length, Q = GA ? GA(g) : new r.constructor(g);
        return r.copy(Q), Q;
      }
      function _f(r) {
        var a = new r.constructor(r.byteLength);
        return new SA(a).set(new SA(r)), a;
      }
      function GC(r, a) {
        var g = a ? _f(r.buffer) : r.buffer;
        return new r.constructor(g, r.byteOffset, r.byteLength);
      }
      function VC(r) {
        var a = new r.constructor(r.source, qn.exec(r));
        return a.lastIndex = r.lastIndex, a;
      }
      function WC(r) {
        return Lo ? be(Lo.call(r)) : {};
      }
      function Cg(r, a) {
        var g = a ? _f(r.buffer) : r.buffer;
        return new r.constructor(g, r.byteOffset, r.length);
      }
      function Qg(r, a) {
        if (r !== a) {
          var g = r !== t, Q = r === null, x = r === r, O = tn(r), $ = a !== t, W = a === null, tA = a === a, mA = tn(a);
          if (!W && !mA && !O && r > a || O && $ && tA && !W && !mA || Q && $ && tA || !g && tA || !x)
            return 1;
          if (!Q && !O && !mA && r < a || mA && g && x && !Q && !O || W && g && x || !$ && x || !tA)
            return -1;
        }
        return 0;
      }
      function XC(r, a, g) {
        for (var Q = -1, x = r.criteria, O = a.criteria, $ = x.length, W = g.length; ++Q < $; ) {
          var tA = Qg(x[Q], O[Q]);
          if (tA) {
            if (Q >= W)
              return tA;
            var mA = g[Q];
            return tA * (mA == "desc" ? -1 : 1);
          }
        }
        return r.index - a.index;
      }
      function Fg(r, a, g, Q) {
        for (var x = -1, O = r.length, $ = g.length, W = -1, tA = a.length, mA = ut(O - $, 0), vA = sA(tA + mA), xA = !Q; ++W < tA; )
          vA[W] = a[W];
        for (; ++x < $; )
          (xA || x < O) && (vA[g[x]] = r[x]);
        for (; mA--; )
          vA[W++] = r[x++];
        return vA;
      }
      function Ug(r, a, g, Q) {
        for (var x = -1, O = r.length, $ = -1, W = g.length, tA = -1, mA = a.length, vA = ut(O - W, 0), xA = sA(vA + mA), DA = !Q; ++x < vA; )
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
      function qC(r, a) {
        return tr(r, Df(r), a);
      }
      function zC(r, a) {
        return tr(r, Mg(r), a);
      }
      function Su(r, a) {
        return function(g, Q) {
          var x = le(g) ? d : BC, O = a ? a() : {};
          return x(g, r, YA(Q, 2), O);
        };
      }
      function Ea(r) {
        return we(function(a, g) {
          var Q = -1, x = g.length, O = x > 1 ? g[x - 1] : t, $ = x > 2 ? g[2] : t;
          for (O = r.length > 3 && typeof O == "function" ? (x--, O) : t, $ && Kt(g[0], g[1], $) && (O = x < 3 ? t : O, x = 1), a = be(a); ++Q < x; ) {
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
      function Eg(r) {
        return function(a, g, Q) {
          for (var x = -1, O = be(a), $ = Q(a), W = $.length; W--; ) {
            var tA = $[r ? W : ++x];
            if (g(O[tA], tA, O) === !1)
              break;
          }
          return a;
        };
      }
      function JC(r, a, g) {
        var Q = a & F, x = Po(r);
        function O() {
          var $ = this && this !== Ye && this instanceof O ? x : r;
          return $.apply(Q ? g : this, arguments);
        }
        return O;
      }
      function _g(r) {
        return function(a) {
          a = Oe(a);
          var g = Yn(a) ? Bt(a) : t, Q = g ? g[0] : a.charAt(0), x = g ? oi(g, 1).join("") : a.slice(1);
          return Q[r]() + x;
        };
      }
      function _a(r) {
        return function(a) {
          return nA(bB(UB(a).replace(su, "")), r, "");
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
          return Je(Q) ? Q : g;
        };
      }
      function jC(r, a, g) {
        var Q = Po(r);
        function x() {
          for (var O = arguments.length, $ = sA(O), W = O, tA = xa(x); W--; )
            $[W] = arguments[W];
          var mA = O < 3 && $[0] !== tA && $[O - 1] !== tA ? [] : Zn($, tA);
          if (O -= mA.length, O < g)
            return Lg(
              r,
              a,
              Lu,
              x.placeholder,
              t,
              $,
              mA,
              t,
              t,
              g - O
            );
          var vA = this && this !== Ye && this instanceof x ? Q : r;
          return u(vA, this, $);
        }
        return x;
      }
      function xg(r) {
        return function(a, g, Q) {
          var x = be(a);
          if (!Wt(a)) {
            var O = YA(g, 3);
            a = dt(a), g = function(W) {
              return O(x[W], W, x);
            };
          }
          var $ = r(a, g, Q);
          return $ > -1 ? x[O ? a[$] : $] : t;
        };
      }
      function Ig(r) {
        return br(function(a) {
          var g = a.length, Q = g, x = fn.prototype.thru;
          for (r && a.reverse(); Q--; ) {
            var O = a[Q];
            if (typeof O != "function")
              throw new wt(l);
            if (x && !$ && Nu(O) == "wrapper")
              var $ = new fn([], !0);
          }
          for (Q = $ ? Q : g; ++Q < g; ) {
            O = a[Q];
            var W = Nu(O), tA = W == "wrapper" ? Lf(O) : t;
            tA && Nf(tA[0]) && tA[1] == (J | D | M | hA) && !tA[4].length && tA[9] == 1 ? $ = $[Nu(tA[0])].apply($, tA[3]) : $ = O.length == 1 && Nf(O) ? $[W]() : $.thru(O);
          }
          return function() {
            var mA = arguments, vA = mA[0];
            if ($ && mA.length == 1 && le(vA))
              return $.plant(vA).value();
            for (var xA = 0, DA = g ? a[xA].apply(this, mA) : vA; ++xA < g; )
              DA = a[xA].call(this, DA);
            return DA;
          };
        });
      }
      function Lu(r, a, g, Q, x, O, $, W, tA, mA) {
        var vA = a & J, xA = a & F, DA = a & U, $A = a & (D | E), ee = a & cA, Be = DA ? t : Po(r);
        function te() {
          for (var Qe = arguments.length, Ee = sA(Qe), nn = Qe; nn--; )
            Ee[nn] = arguments[nn];
          if ($A)
            var Rt = xa(te), rn = mr(Ee, Rt);
          if (Q && (Ee = Fg(Ee, Q, x, $A)), O && (Ee = Ug(Ee, O, $, $A)), Qe -= rn, $A && Qe < mA) {
            var tt = Zn(Ee, Rt);
            return Lg(
              r,
              a,
              Lu,
              te.placeholder,
              g,
              Ee,
              tt,
              W,
              tA,
              mA - Qe
            );
          }
          var Nn = xA ? g : this, Ir = DA ? Nn[r] : r;
          return Qe = Ee.length, W ? Ee = BQ(Ee, W) : ee && Qe > 1 && Ee.reverse(), vA && tA < Qe && (Ee.length = tA), this && this !== Ye && this instanceof te && (Ir = Be || Po(Ir)), Ir.apply(Nn, Ee);
        }
        return te;
      }
      function Hg(r, a) {
        return function(g, Q) {
          return UC(g, r, a(Q), {});
        };
      }
      function Tu(r, a) {
        return function(g, Q) {
          var x;
          if (g === t && Q === t)
            return a;
          if (g !== t && (x = g), Q !== t) {
            if (x === t)
              return Q;
            typeof g == "string" || typeof Q == "string" ? (g = en(g), Q = en(Q)) : (g = gg(g), Q = gg(Q)), x = r(g, Q);
          }
          return x;
        };
      }
      function xf(r) {
        return br(function(a) {
          return a = z(a, Ke(YA())), we(function(g) {
            var Q = this;
            return r(a, function(x) {
              return u(x, Q, g);
            });
          });
        });
      }
      function Du(r, a) {
        a = a === t ? " " : en(a);
        var g = a.length;
        if (g < 2)
          return g ? Cf(a, r) : a;
        var Q = Cf(a, Ar(r / Ai(a)));
        return Yn(a) ? oi(Bt(Q), 0, r).join("") : Q.slice(0, r);
      }
      function YC(r, a, g, Q) {
        var x = a & F, O = Po(r);
        function $() {
          for (var W = -1, tA = arguments.length, mA = -1, vA = Q.length, xA = sA(vA + tA), DA = this && this !== Ye && this instanceof $ ? O : r; ++mA < vA; )
            xA[mA] = Q[mA];
          for (; tA--; )
            xA[mA++] = arguments[++W];
          return u(DA, x ? g : this, xA);
        }
        return $;
      }
      function Sg(r) {
        return function(a, g, Q) {
          return Q && typeof Q != "number" && Kt(a, g, Q) && (g = Q = t), a = xr(a), g === t ? (g = a, a = 0) : g = xr(g), Q = Q === t ? a < g ? 1 : -1 : xr(Q), NC(a, g, Q, r);
        };
      }
      function Ou(r) {
        return function(a, g) {
          return typeof a == "string" && typeof g == "string" || (a = gn(a), g = gn(g)), r(a, g);
        };
      }
      function Lg(r, a, g, Q, x, O, $, W, tA, mA) {
        var vA = a & D, xA = vA ? $ : t, DA = vA ? t : $, $A = vA ? O : t, ee = vA ? t : O;
        a |= vA ? M : K, a &= ~(vA ? K : M), a & H || (a &= ~(F | U));
        var Be = [
          r,
          a,
          x,
          $A,
          xA,
          ee,
          DA,
          W,
          tA,
          mA
        ], te = g.apply(t, Be);
        return Nf(r) && Vg(te, Be), te.placeholder = Q, Wg(te, r, a);
      }
      function If(r) {
        var a = Ze[r];
        return function(g, Q) {
          if (g = gn(g), Q = Q == null ? 0 : It(pe(Q), 292), Q && Wp(g)) {
            var x = (Oe(g) + "e").split("e"), O = a(x[0] + "e" + (+x[1] + Q));
            return x = (Oe(O) + "e").split("e"), +(x[0] + "e" + (+x[1] - Q));
          }
          return a(g);
        };
      }
      var ZC = Fa && 1 / Ca(new Fa([, -0]))[1] == gA ? function(r) {
        return new Fa(r);
      } : Yf;
      function Tg(r) {
        return function(a) {
          var g = Ht(a);
          return g == eA ? Eo(a) : g == he ? mu(a) : jn(a, r(a));
        };
      }
      function Ur(r, a, g, Q, x, O, $, W) {
        var tA = a & U;
        if (!tA && typeof r != "function")
          throw new wt(l);
        var mA = Q ? Q.length : 0;
        if (mA || (a &= ~(M | K), Q = x = t), $ = $ === t ? $ : ut(pe($), 0), W = W === t ? W : pe(W), mA -= x ? x.length : 0, a & K) {
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
        if (DA && dQ($A, DA), r = $A[0], a = $A[1], g = $A[2], Q = $A[3], x = $A[4], W = $A[9] = $A[9] === t ? tA ? 0 : r.length : ut($A[9] - mA, 0), !W && a & (D | E) && (a &= ~(D | E)), !a || a == F)
          var ee = JC(r, a, g);
        else a == D || a == E ? ee = jC(r, a, W) : (a == M || a == (F | M)) && !x.length ? ee = YC(r, a, g, Q) : ee = Lu.apply(t, $A);
        var Be = DA ? dg : Vg;
        return Wg(Be(ee, $A), r, a);
      }
      function Dg(r, a, g, Q) {
        return r === t || On(r, ti[g]) && !Se.call(Q, g) ? a : r;
      }
      function Og(r, a, g, Q, x, O) {
        return Je(r) && Je(a) && (O.set(a, r), xu(r, a, t, Og, O), O.delete(a)), r;
      }
      function AQ(r) {
        return ko(r) ? t : r;
      }
      function Ng(r, a, g, Q, x, O) {
        var $ = g & o, W = r.length, tA = a.length;
        if (W != tA && !($ && tA > W))
          return !1;
        var mA = O.get(r), vA = O.get(a);
        if (mA && vA)
          return mA == a && vA == r;
        var xA = -1, DA = !0, $A = g & C ? new Di() : t;
        for (O.set(r, a), O.set(a, r); ++xA < W; ) {
          var ee = r[xA], Be = a[xA];
          if (Q)
            var te = $ ? Q(Be, ee, xA, a, r, O) : Q(ee, Be, xA, r, a, O);
          if (te !== t) {
            if (te)
              continue;
            DA = !1;
            break;
          }
          if ($A) {
            if (!LA(a, function(Qe, Ee) {
              if (!Hi($A, Ee) && (ee === Qe || x(ee, Qe, g, Q, O)))
                return $A.push(Ee);
            })) {
              DA = !1;
              break;
            }
          } else if (!(ee === Be || x(ee, Be, g, Q, O))) {
            DA = !1;
            break;
          }
        }
        return O.delete(r), O.delete(a), DA;
      }
      function eQ(r, a, g, Q, x, O, $) {
        switch (g) {
          case gt:
            if (r.byteLength != a.byteLength || r.byteOffset != a.byteOffset)
              return !1;
            r = r.buffer, a = a.buffer;
          case Ut:
            return !(r.byteLength != a.byteLength || !O(new SA(r), new SA(a)));
          case _A:
          case zA:
          case lA:
            return On(+r, +a);
          case X:
            return r.name == a.name && r.message == a.message;
          case fe:
          case Te:
            return r == a + "";
          case eA:
            var W = Eo;
          case he:
            var tA = Q & o;
            if (W || (W = Ca), r.size != a.size && !tA)
              return !1;
            var mA = $.get(r);
            if (mA)
              return mA == a;
            Q |= C, $.set(r, a);
            var vA = Ng(W(r), W(a), Q, x, O, $);
            return $.delete(r), vA;
          case ce:
            if (Lo)
              return Lo.call(r) == Lo.call(a);
        }
        return !1;
      }
      function tQ(r, a, g, Q, x, O) {
        var $ = g & o, W = Hf(r), tA = W.length, mA = Hf(a), vA = mA.length;
        if (tA != vA && !$)
          return !1;
        for (var xA = tA; xA--; ) {
          var DA = W[xA];
          if (!($ ? DA in a : Se.call(a, DA)))
            return !1;
        }
        var $A = O.get(r), ee = O.get(a);
        if ($A && ee)
          return $A == a && ee == r;
        var Be = !0;
        O.set(r, a), O.set(a, r);
        for (var te = $; ++xA < tA; ) {
          DA = W[xA];
          var Qe = r[DA], Ee = a[DA];
          if (Q)
            var nn = $ ? Q(Ee, Qe, DA, a, r, O) : Q(Qe, Ee, DA, r, a, O);
          if (!(nn === t ? Qe === Ee || x(Qe, Ee, g, Q, O) : nn)) {
            Be = !1;
            break;
          }
          te || (te = DA == "constructor");
        }
        if (Be && !te) {
          var Rt = r.constructor, rn = a.constructor;
          Rt != rn && "constructor" in r && "constructor" in a && !(typeof Rt == "function" && Rt instanceof Rt && typeof rn == "function" && rn instanceof rn) && (Be = !1);
        }
        return O.delete(r), O.delete(a), Be;
      }
      function br(r) {
        return Pf($g(r, t, Yg), r + "");
      }
      function Hf(r) {
        return ng(r, dt, Df);
      }
      function Sf(r) {
        return ng(r, Xt, Mg);
      }
      var Lf = Qu ? function(r) {
        return Qu.get(r);
      } : Yf;
      function Nu(r) {
        for (var a = r.name + "", g = Ua[a], Q = Se.call(Ua, a) ? g.length : 0; Q--; ) {
          var x = g[Q], O = x.func;
          if (O == null || O == r)
            return x.name;
        }
        return a;
      }
      function xa(r) {
        var a = Se.call(L, "placeholder") ? L : r;
        return a.placeholder;
      }
      function YA() {
        var r = L.iteratee || Jf;
        return r = r === Jf ? ag : r, arguments.length ? r(arguments[0], arguments[1]) : r;
      }
      function Mu(r, a) {
        var g = r.__data__;
        return lQ(a) ? g[typeof a == "string" ? "string" : "hash"] : g.map;
      }
      function Tf(r) {
        for (var a = dt(r), g = a.length; g--; ) {
          var Q = a[g], x = r[Q];
          a[g] = [Q, x, Rg(x)];
        }
        return a;
      }
      function Mi(r, a) {
        var g = Bu(r, a);
        return ig(g) ? g : t;
      }
      function nQ(r) {
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
          return Ae.call(r, a);
        }));
      } : Zf, Mg = sf ? function(r) {
        for (var a = []; r; )
          Y(a, Df(r)), r = ne(r);
        return a;
      } : Zf, Ht = Pt;
      (uf && Ht(new uf(new ArrayBuffer(1))) != gt || Io && Ht(new Io()) != eA || lf && Ht(lf.resolve()) != se || Fa && Ht(new Fa()) != he || Ho && Ht(new Ho()) != Ft) && (Ht = function(r) {
        var a = Pt(r), g = a == jA ? r.constructor : t, Q = g ? Pi(g) : "";
        if (Q)
          switch (Q) {
            case Py:
              return gt;
            case Ky:
              return eA;
            case Ry:
              return se;
            case ky:
              return he;
            case $y:
              return Ft;
          }
        return a;
      });
      function rQ(r, a, g) {
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
              a = It(a, r + $);
              break;
            case "takeRight":
              r = ut(r, a - $);
              break;
          }
        }
        return { start: r, end: a };
      }
      function iQ(r) {
        var a = r.match(Vs);
        return a ? a[1].split(ua) : [];
      }
      function Pg(r, a, g) {
        a = ai(a, r);
        for (var Q = -1, x = a.length, O = !1; ++Q < x; ) {
          var $ = nr(a[Q]);
          if (!(O = r != null && g(r, $)))
            break;
          r = r[$];
        }
        return O || ++Q != x ? O : (x = r == null ? 0 : r.length, !!x && Vu(x) && Er($, x) && (le(r) || Ki(r)));
      }
      function aQ(r) {
        var a = r.length, g = new r.constructor(a);
        return a && typeof r[0] == "string" && Se.call(r, "index") && (g.index = r.index, g.input = r.input), g;
      }
      function Kg(r) {
        return typeof r.constructor == "function" && !Ko(r) ? ba(ne(r)) : {};
      }
      function oQ(r, a, g) {
        var Q = r.constructor;
        switch (a) {
          case Ut:
            return _f(r);
          case _A:
          case zA:
            return new Q(+r);
          case gt:
            return GC(r, g);
          case un:
          case dr:
          case Qi:
          case Gr:
          case Vr:
          case pA:
          case MA:
          case XA:
          case ye:
            return Cg(r, g);
          case eA:
            return new Q();
          case lA:
          case Te:
            return new Q(r);
          case fe:
            return VC(r);
          case he:
            return new Q();
          case ce:
            return WC(r);
        }
      }
      function sQ(r, a) {
        var g = a.length;
        if (!g)
          return r;
        var Q = g - 1;
        return a[Q] = (g > 1 ? "& " : "") + a[Q], a = a.join(g > 2 ? ", " : " "), r.replace(Gs, `{
/* [wrapped with ` + a + `] */
`);
      }
      function uQ(r) {
        return le(r) || Ki(r) || !!(Le && r && r[Le]);
      }
      function Er(r, a) {
        var g = typeof r;
        return a = a ?? IA, !!a && (g == "number" || g != "symbol" && $c.test(r)) && r > -1 && r % 1 == 0 && r < a;
      }
      function Kt(r, a, g) {
        if (!Je(g))
          return !1;
        var Q = typeof a;
        return (Q == "number" ? Wt(g) && Er(a, g.length) : Q == "string" && a in g) ? On(g[a], r) : !1;
      }
      function Of(r, a) {
        if (le(r))
          return !1;
        var g = typeof r;
        return g == "number" || g == "symbol" || g == "boolean" || r == null || tn(r) ? !0 : pr.test(r) || !Xr.test(r) || a != null && r in be(a);
      }
      function lQ(r) {
        var a = typeof r;
        return a == "string" || a == "number" || a == "symbol" || a == "boolean" ? r !== "__proto__" : r === null;
      }
      function Nf(r) {
        var a = Nu(r), g = L[a];
        if (typeof g != "function" || !(a in Fe.prototype))
          return !1;
        if (r === g)
          return !0;
        var Q = Lf(g);
        return !!Q && r === Q[0];
      }
      function cQ(r) {
        return !!N && N in r;
      }
      var fQ = yr ? _r : Ah;
      function Ko(r) {
        var a = r && r.constructor, g = typeof a == "function" && a.prototype || ti;
        return r === g;
      }
      function Rg(r) {
        return r === r && !Je(r);
      }
      function kg(r, a) {
        return function(g) {
          return g == null ? !1 : g[r] === a && (a !== t || r in be(g));
        };
      }
      function hQ(r) {
        var a = $u(r, function(Q) {
          return g.size === h && g.clear(), Q;
        }), g = a.cache;
        return a;
      }
      function dQ(r, a) {
        var g = r[1], Q = a[1], x = g | Q, O = x < (F | U | J), $ = Q == J && g == D || Q == J && g == hA && r[7].length <= a[8] || Q == (J | hA) && a[7].length <= a[8] && g == D;
        if (!(O || $))
          return r;
        Q & F && (r[2] = a[2], x |= g & F ? 0 : H);
        var W = a[3];
        if (W) {
          var tA = r[3];
          r[3] = tA ? Fg(tA, W, a[4]) : W, r[4] = tA ? Zn(r[3], w) : a[4];
        }
        return W = a[5], W && (tA = r[5], r[5] = tA ? Ug(tA, W, a[6]) : W, r[6] = tA ? Zn(r[5], w) : a[6]), W = a[7], W && (r[7] = W), Q & J && (r[8] = r[8] == null ? a[8] : It(r[8], a[8])), r[9] == null && (r[9] = a[9]), r[0] = a[0], r[1] = x, r;
      }
      function pQ(r) {
        var a = [];
        if (r != null)
          for (var g in be(r))
            a.push(g);
        return a;
      }
      function gQ(r) {
        return G.call(r);
      }
      function $g(r, a, g) {
        return a = ut(a === t ? r.length - 1 : a, 0), function() {
          for (var Q = arguments, x = -1, O = ut(Q.length - a, 0), $ = sA(O); ++x < O; )
            $[x] = Q[a + x];
          x = -1;
          for (var W = sA(a + 1); ++x < a; )
            W[x] = Q[x];
          return W[a] = g($), u(r, this, W);
        };
      }
      function Gg(r, a) {
        return a.length < 2 ? r : Ni(r, dn(a, 0, -1));
      }
      function BQ(r, a) {
        for (var g = r.length, Q = It(a.length, g), x = Vt(r); Q--; ) {
          var O = a[Q];
          r[Q] = Er(O, g) ? x[O] : t;
        }
        return r;
      }
      function Mf(r, a) {
        if (!(a === "constructor" && typeof r[a] == "function") && a != "__proto__")
          return r[a];
      }
      var Vg = Xg(dg), Ro = Li || function(r, a) {
        return Ye.setTimeout(r, a);
      }, Pf = Xg(KC);
      function Wg(r, a, g) {
        var Q = a + "";
        return Pf(r, sQ(Q, wQ(iQ(Q), g)));
      }
      function Xg(r) {
        var a = 0, g = 0;
        return function() {
          var Q = Oy(), x = EA - (Q - g);
          if (g = Q, x > 0) {
            if (++a >= OA)
              return arguments[0];
          } else
            a = 0;
          return r.apply(t, arguments);
        };
      }
      function Pu(r, a) {
        var g = -1, Q = r.length, x = Q - 1;
        for (a = a === t ? Q : a; ++g < a; ) {
          var O = yf(g, x), $ = r[O];
          r[O] = r[g], r[g] = $;
        }
        return r.length = a, r;
      }
      var qg = hQ(function(r) {
        var a = [];
        return r.charCodeAt(0) === 46 && a.push(""), r.replace($s, function(g, Q, x, O) {
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
      function wQ(r, a) {
        return m(S, function(g) {
          var Q = "_." + g[0];
          a & g[1] && !I(r, Q) && r.push(Q);
        }), r.sort();
      }
      function zg(r) {
        if (r instanceof Fe)
          return r.clone();
        var a = new fn(r.__wrapped__, r.__chain__);
        return a.__actions__ = Vt(r.__actions__), a.__index__ = r.__index__, a.__values__ = r.__values__, a;
      }
      function mQ(r, a, g) {
        (g ? Kt(r, a, g) : a === t) ? a = 1 : a = ut(pe(a), 0);
        var Q = r == null ? 0 : r.length;
        if (!Q || a < 1)
          return [];
        for (var x = 0, O = 0, $ = sA(Ar(Q / a)); x < Q; )
          $[O++] = dn(r, x, x += a);
        return $;
      }
      function vQ(r) {
        for (var a = -1, g = r == null ? 0 : r.length, Q = 0, x = []; ++a < g; ) {
          var O = r[a];
          O && (x[Q++] = O);
        }
        return x;
      }
      function yQ() {
        var r = arguments.length;
        if (!r)
          return [];
        for (var a = sA(r - 1), g = arguments[0], Q = r; Q--; )
          a[Q - 1] = arguments[Q];
        return Y(le(g) ? Vt(g) : [g], mt(a, 1));
      }
      var CQ = we(function(r, a) {
        return et(r) ? Do(r, mt(a, 1, et, !0)) : [];
      }), QQ = we(function(r, a) {
        var g = pn(a);
        return et(g) && (g = t), et(r) ? Do(r, mt(a, 1, et, !0), YA(g, 2)) : [];
      }), FQ = we(function(r, a) {
        var g = pn(a);
        return et(g) && (g = t), et(r) ? Do(r, mt(a, 1, et, !0), t, g) : [];
      });
      function UQ(r, a, g) {
        var Q = r == null ? 0 : r.length;
        return Q ? (a = g || a === t ? 1 : pe(a), dn(r, a < 0 ? 0 : a, Q)) : [];
      }
      function bQ(r, a, g) {
        var Q = r == null ? 0 : r.length;
        return Q ? (a = g || a === t ? 1 : pe(a), a = Q - a, dn(r, 0, a < 0 ? 0 : a)) : [];
      }
      function EQ(r, a) {
        return r && r.length ? Hu(r, YA(a, 3), !0, !0) : [];
      }
      function _Q(r, a) {
        return r && r.length ? Hu(r, YA(a, 3), !0) : [];
      }
      function xQ(r, a, g, Q) {
        var x = r == null ? 0 : r.length;
        return x ? (g && typeof g != "number" && Kt(r, a, g) && (g = 0, Q = x), yC(r, a, g, Q)) : [];
      }
      function Jg(r, a, g) {
        var Q = r == null ? 0 : r.length;
        if (!Q)
          return -1;
        var x = g == null ? 0 : pe(g);
        return x < 0 && (x = ut(Q + x, 0)), ft(r, YA(a, 3), x);
      }
      function jg(r, a, g) {
        var Q = r == null ? 0 : r.length;
        if (!Q)
          return -1;
        var x = Q - 1;
        return g !== t && (x = pe(g), x = g < 0 ? ut(Q + x, 0) : It(x, Q - 1)), ft(r, YA(a, 3), x, !0);
      }
      function Yg(r) {
        var a = r == null ? 0 : r.length;
        return a ? mt(r, 1) : [];
      }
      function IQ(r) {
        var a = r == null ? 0 : r.length;
        return a ? mt(r, gA) : [];
      }
      function HQ(r, a) {
        var g = r == null ? 0 : r.length;
        return g ? (a = a === t ? 1 : pe(a), mt(r, a)) : [];
      }
      function SQ(r) {
        for (var a = -1, g = r == null ? 0 : r.length, Q = {}; ++a < g; ) {
          var x = r[a];
          Q[x[0]] = x[1];
        }
        return Q;
      }
      function Zg(r) {
        return r && r.length ? r[0] : t;
      }
      function LQ(r, a, g) {
        var Q = r == null ? 0 : r.length;
        if (!Q)
          return -1;
        var x = g == null ? 0 : pe(g);
        return x < 0 && (x = ut(Q + x, 0)), qe(r, a, x);
      }
      function TQ(r) {
        var a = r == null ? 0 : r.length;
        return a ? dn(r, 0, -1) : [];
      }
      var DQ = we(function(r) {
        var a = z(r, bf);
        return a.length && a[0] === r[0] ? gf(a) : [];
      }), OQ = we(function(r) {
        var a = pn(r), g = z(r, bf);
        return a === pn(g) ? a = t : g.pop(), g.length && g[0] === r[0] ? gf(g, YA(a, 2)) : [];
      }), NQ = we(function(r) {
        var a = pn(r), g = z(r, bf);
        return a = typeof a == "function" ? a : t, a && g.pop(), g.length && g[0] === r[0] ? gf(g, t, a) : [];
      });
      function MQ(r, a) {
        return r == null ? "" : Ty.call(r, a);
      }
      function pn(r) {
        var a = r == null ? 0 : r.length;
        return a ? r[a - 1] : t;
      }
      function PQ(r, a, g) {
        var Q = r == null ? 0 : r.length;
        if (!Q)
          return -1;
        var x = Q;
        return g !== t && (x = pe(g), x = x < 0 ? ut(Q + x, 0) : It(x, Q - 1)), a === a ? rf(r, a, x) : ft(r, kA, x, !0);
      }
      function KQ(r, a) {
        return r && r.length ? lg(r, pe(a)) : t;
      }
      var RQ = we(AB);
      function AB(r, a) {
        return r && r.length && a && a.length ? vf(r, a) : r;
      }
      function kQ(r, a, g) {
        return r && r.length && a && a.length ? vf(r, a, YA(g, 2)) : r;
      }
      function $Q(r, a, g) {
        return r && r.length && a && a.length ? vf(r, a, t, g) : r;
      }
      var GQ = br(function(r, a) {
        var g = r == null ? 0 : r.length, Q = ff(r, a);
        return hg(r, z(a, function(x) {
          return Er(x, g) ? +x : x;
        }).sort(Qg)), Q;
      });
      function VQ(r, a) {
        var g = [];
        if (!(r && r.length))
          return g;
        var Q = -1, x = [], O = r.length;
        for (a = YA(a, 3); ++Q < O; ) {
          var $ = r[Q];
          a($, Q, r) && (g.push($), x.push(Q));
        }
        return hg(r, x), g;
      }
      function Kf(r) {
        return r == null ? r : My.call(r);
      }
      function WQ(r, a, g) {
        var Q = r == null ? 0 : r.length;
        return Q ? (g && typeof g != "number" && Kt(r, a, g) ? (a = 0, g = Q) : (a = a == null ? 0 : pe(a), g = g === t ? Q : pe(g)), dn(r, a, g)) : [];
      }
      function XQ(r, a) {
        return Iu(r, a);
      }
      function qQ(r, a, g) {
        return Qf(r, a, YA(g, 2));
      }
      function zQ(r, a) {
        var g = r == null ? 0 : r.length;
        if (g) {
          var Q = Iu(r, a);
          if (Q < g && On(r[Q], a))
            return Q;
        }
        return -1;
      }
      function JQ(r, a) {
        return Iu(r, a, !0);
      }
      function jQ(r, a, g) {
        return Qf(r, a, YA(g, 2), !0);
      }
      function YQ(r, a) {
        var g = r == null ? 0 : r.length;
        if (g) {
          var Q = Iu(r, a, !0) - 1;
          if (On(r[Q], a))
            return Q;
        }
        return -1;
      }
      function ZQ(r) {
        return r && r.length ? pg(r) : [];
      }
      function AF(r, a) {
        return r && r.length ? pg(r, YA(a, 2)) : [];
      }
      function eF(r) {
        var a = r == null ? 0 : r.length;
        return a ? dn(r, 1, a) : [];
      }
      function tF(r, a, g) {
        return r && r.length ? (a = g || a === t ? 1 : pe(a), dn(r, 0, a < 0 ? 0 : a)) : [];
      }
      function nF(r, a, g) {
        var Q = r == null ? 0 : r.length;
        return Q ? (a = g || a === t ? 1 : pe(a), a = Q - a, dn(r, a < 0 ? 0 : a, Q)) : [];
      }
      function rF(r, a) {
        return r && r.length ? Hu(r, YA(a, 3), !1, !0) : [];
      }
      function iF(r, a) {
        return r && r.length ? Hu(r, YA(a, 3)) : [];
      }
      var aF = we(function(r) {
        return ii(mt(r, 1, et, !0));
      }), oF = we(function(r) {
        var a = pn(r);
        return et(a) && (a = t), ii(mt(r, 1, et, !0), YA(a, 2));
      }), sF = we(function(r) {
        var a = pn(r);
        return a = typeof a == "function" ? a : t, ii(mt(r, 1, et, !0), t, a);
      });
      function uF(r) {
        return r && r.length ? ii(r) : [];
      }
      function lF(r, a) {
        return r && r.length ? ii(r, YA(a, 2)) : [];
      }
      function cF(r, a) {
        return a = typeof a == "function" ? a : t, r && r.length ? ii(r, t, a) : [];
      }
      function Rf(r) {
        if (!(r && r.length))
          return [];
        var a = 0;
        return r = _(r, function(g) {
          if (et(g))
            return a = ut(g.length, a), !0;
        }), In(a, function(g) {
          return z(r, ue(g));
        });
      }
      function eB(r, a) {
        if (!(r && r.length))
          return [];
        var g = Rf(r);
        return a == null ? g : z(g, function(Q) {
          return u(a, t, Q);
        });
      }
      var fF = we(function(r, a) {
        return et(r) ? Do(r, a) : [];
      }), hF = we(function(r) {
        return Uf(_(r, et));
      }), dF = we(function(r) {
        var a = pn(r);
        return et(a) && (a = t), Uf(_(r, et), YA(a, 2));
      }), pF = we(function(r) {
        var a = pn(r);
        return a = typeof a == "function" ? a : t, Uf(_(r, et), t, a);
      }), gF = we(Rf);
      function BF(r, a) {
        return mg(r || [], a || [], To);
      }
      function wF(r, a) {
        return mg(r || [], a || [], Mo);
      }
      var mF = we(function(r) {
        var a = r.length, g = a > 1 ? r[a - 1] : t;
        return g = typeof g == "function" ? (r.pop(), g) : t, eB(r, g);
      });
      function tB(r) {
        var a = L(r);
        return a.__chain__ = !0, a;
      }
      function vF(r, a) {
        return a(r), r;
      }
      function Ku(r, a) {
        return a(r);
      }
      var yF = br(function(r) {
        var a = r.length, g = a ? r[0] : 0, Q = this.__wrapped__, x = function(O) {
          return ff(O, r);
        };
        return a > 1 || this.__actions__.length || !(Q instanceof Fe) || !Er(g) ? this.thru(x) : (Q = Q.slice(g, +g + (a ? 1 : 0)), Q.__actions__.push({
          func: Ku,
          args: [x],
          thisArg: t
        }), new fn(Q, this.__chain__).thru(function(O) {
          return a && !O.length && O.push(t), O;
        }));
      });
      function CF() {
        return tB(this);
      }
      function QF() {
        return new fn(this.value(), this.__chain__);
      }
      function FF() {
        this.__values__ === t && (this.__values__ = gB(this.value()));
        var r = this.__index__ >= this.__values__.length, a = r ? t : this.__values__[this.__index__++];
        return { done: r, value: a };
      }
      function UF() {
        return this;
      }
      function bF(r) {
        for (var a, g = this; g instanceof Uu; ) {
          var Q = zg(g);
          Q.__index__ = 0, Q.__values__ = t, a ? x.__wrapped__ = Q : a = Q;
          var x = Q;
          g = g.__wrapped__;
        }
        return x.__wrapped__ = r, a;
      }
      function EF() {
        var r = this.__wrapped__;
        if (r instanceof Fe) {
          var a = r;
          return this.__actions__.length && (a = new Fe(this)), a = a.reverse(), a.__actions__.push({
            func: Ku,
            args: [Kf],
            thisArg: t
          }), new fn(a, this.__chain__);
        }
        return this.thru(Kf);
      }
      function _F() {
        return wg(this.__wrapped__, this.__actions__);
      }
      var xF = Su(function(r, a, g) {
        Se.call(r, g) ? ++r[g] : Fr(r, g, 1);
      });
      function IF(r, a, g) {
        var Q = le(r) ? b : vC;
        return g && Kt(r, a, g) && (a = t), Q(r, YA(a, 3));
      }
      function HF(r, a) {
        var g = le(r) ? _ : eg;
        return g(r, YA(a, 3));
      }
      var SF = xg(Jg), LF = xg(jg);
      function TF(r, a) {
        return mt(Ru(r, a), 1);
      }
      function DF(r, a) {
        return mt(Ru(r, a), gA);
      }
      function OF(r, a, g) {
        return g = g === t ? 1 : pe(g), mt(Ru(r, a), g);
      }
      function nB(r, a) {
        var g = le(r) ? m : ri;
        return g(r, YA(a, 3));
      }
      function rB(r, a) {
        var g = le(r) ? y : Ag;
        return g(r, YA(a, 3));
      }
      var NF = Su(function(r, a, g) {
        Se.call(r, g) ? r[g].push(a) : Fr(r, g, [a]);
      });
      function MF(r, a, g, Q) {
        r = Wt(r) ? r : Ha(r), g = g && !Q ? pe(g) : 0;
        var x = r.length;
        return g < 0 && (g = ut(x + g, 0)), Wu(r) ? g <= x && r.indexOf(a, g) > -1 : !!x && qe(r, a, g) > -1;
      }
      var PF = we(function(r, a, g) {
        var Q = -1, x = typeof a == "function", O = Wt(r) ? sA(r.length) : [];
        return ri(r, function($) {
          O[++Q] = x ? u(a, $, g) : Oo($, a, g);
        }), O;
      }), KF = Su(function(r, a, g) {
        Fr(r, g, a);
      });
      function Ru(r, a) {
        var g = le(r) ? z : og;
        return g(r, YA(a, 3));
      }
      function RF(r, a, g, Q) {
        return r == null ? [] : (le(a) || (a = a == null ? [] : [a]), g = Q ? t : g, le(g) || (g = g == null ? [] : [g]), cg(r, a, g));
      }
      var kF = Su(function(r, a, g) {
        r[g ? 0 : 1].push(a);
      }, function() {
        return [[], []];
      });
      function $F(r, a, g) {
        var Q = le(r) ? nA : xn, x = arguments.length < 3;
        return Q(r, YA(a, 4), g, x, ri);
      }
      function GF(r, a, g) {
        var Q = le(r) ? FA : xn, x = arguments.length < 3;
        return Q(r, YA(a, 4), g, x, Ag);
      }
      function VF(r, a) {
        var g = le(r) ? _ : eg;
        return g(r, Gu(YA(a, 3)));
      }
      function WF(r) {
        var a = le(r) ? Jp : MC;
        return a(r);
      }
      function XF(r, a, g) {
        (g ? Kt(r, a, g) : a === t) ? a = 1 : a = pe(a);
        var Q = le(r) ? pC : PC;
        return Q(r, a);
      }
      function qF(r) {
        var a = le(r) ? gC : RC;
        return a(r);
      }
      function zF(r) {
        if (r == null)
          return 0;
        if (Wt(r))
          return Wu(r) ? Ai(r) : r.length;
        var a = Ht(r);
        return a == eA || a == he ? r.size : wf(r).length;
      }
      function JF(r, a, g) {
        var Q = le(r) ? LA : kC;
        return g && Kt(r, a, g) && (a = t), Q(r, YA(a, 3));
      }
      var jF = we(function(r, a) {
        if (r == null)
          return [];
        var g = a.length;
        return g > 1 && Kt(r, a[0], a[1]) ? a = [] : g > 2 && Kt(a[0], a[1], a[2]) && (a = [a[0]]), cg(r, mt(a, 1), []);
      }), ku = Ge || function() {
        return Ye.Date.now();
      };
      function YF(r, a) {
        if (typeof a != "function")
          throw new wt(l);
        return r = pe(r), function() {
          if (--r < 1)
            return a.apply(this, arguments);
        };
      }
      function iB(r, a, g) {
        return a = g ? t : a, a = r && a == null ? r.length : a, Ur(r, J, t, t, t, t, a);
      }
      function aB(r, a) {
        var g;
        if (typeof a != "function")
          throw new wt(l);
        return r = pe(r), function() {
          return --r > 0 && (g = a.apply(this, arguments)), r <= 1 && (a = t), g;
        };
      }
      var kf = we(function(r, a, g) {
        var Q = F;
        if (g.length) {
          var x = Zn(g, xa(kf));
          Q |= M;
        }
        return Ur(r, Q, a, g, x);
      }), oB = we(function(r, a, g) {
        var Q = F | U;
        if (g.length) {
          var x = Zn(g, xa(oB));
          Q |= M;
        }
        return Ur(a, Q, r, g, x);
      });
      function sB(r, a, g) {
        a = g ? t : a;
        var Q = Ur(r, D, t, t, t, t, t, a);
        return Q.placeholder = sB.placeholder, Q;
      }
      function uB(r, a, g) {
        a = g ? t : a;
        var Q = Ur(r, E, t, t, t, t, t, a);
        return Q.placeholder = uB.placeholder, Q;
      }
      function lB(r, a, g) {
        var Q, x, O, $, W, tA, mA = 0, vA = !1, xA = !1, DA = !0;
        if (typeof r != "function")
          throw new wt(l);
        a = gn(a) || 0, Je(g) && (vA = !!g.leading, xA = "maxWait" in g, O = xA ? ut(gn(g.maxWait) || 0, a) : O, DA = "trailing" in g ? !!g.trailing : DA);
        function $A(tt) {
          var Nn = Q, Ir = x;
          return Q = x = t, mA = tt, $ = r.apply(Ir, Nn), $;
        }
        function ee(tt) {
          return mA = tt, W = Ro(Qe, a), vA ? $A(tt) : $;
        }
        function Be(tt) {
          var Nn = tt - tA, Ir = tt - mA, xB = a - Nn;
          return xA ? It(xB, O - Ir) : xB;
        }
        function te(tt) {
          var Nn = tt - tA, Ir = tt - mA;
          return tA === t || Nn >= a || Nn < 0 || xA && Ir >= O;
        }
        function Qe() {
          var tt = ku();
          if (te(tt))
            return Ee(tt);
          W = Ro(Qe, Be(tt));
        }
        function Ee(tt) {
          return W = t, DA && Q ? $A(tt) : (Q = x = t, $);
        }
        function nn() {
          W !== t && vg(W), mA = 0, Q = tA = x = W = t;
        }
        function Rt() {
          return W === t ? $ : Ee(ku());
        }
        function rn() {
          var tt = ku(), Nn = te(tt);
          if (Q = arguments, x = this, tA = tt, Nn) {
            if (W === t)
              return ee(tA);
            if (xA)
              return vg(W), W = Ro(Qe, a), $A(tA);
          }
          return W === t && (W = Ro(Qe, a)), $;
        }
        return rn.cancel = nn, rn.flush = Rt, rn;
      }
      var ZF = we(function(r, a) {
        return Zp(r, 1, a);
      }), AU = we(function(r, a, g) {
        return Zp(r, gn(a) || 0, g);
      });
      function eU(r) {
        return Ur(r, cA);
      }
      function $u(r, a) {
        if (typeof r != "function" || a != null && typeof a != "function")
          throw new wt(l);
        var g = function() {
          var Q = arguments, x = a ? a.apply(this, Q) : Q[0], O = g.cache;
          if (O.has(x))
            return O.get(x);
          var $ = r.apply(this, Q);
          return g.cache = O.set(x, $) || O, $;
        };
        return g.cache = new ($u.Cache || Qr)(), g;
      }
      $u.Cache = Qr;
      function Gu(r) {
        if (typeof r != "function")
          throw new wt(l);
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
      function tU(r) {
        return aB(2, r);
      }
      var nU = $C(function(r, a) {
        a = a.length == 1 && le(a[0]) ? z(a[0], Ke(YA())) : z(mt(a, 1), Ke(YA()));
        var g = a.length;
        return we(function(Q) {
          for (var x = -1, O = It(Q.length, g); ++x < O; )
            Q[x] = a[x].call(this, Q[x]);
          return u(r, this, Q);
        });
      }), $f = we(function(r, a) {
        var g = Zn(a, xa($f));
        return Ur(r, M, t, a, g);
      }), cB = we(function(r, a) {
        var g = Zn(a, xa(cB));
        return Ur(r, K, t, a, g);
      }), rU = br(function(r, a) {
        return Ur(r, hA, t, t, t, a);
      });
      function iU(r, a) {
        if (typeof r != "function")
          throw new wt(l);
        return a = a === t ? a : pe(a), we(r, a);
      }
      function aU(r, a) {
        if (typeof r != "function")
          throw new wt(l);
        return a = a == null ? 0 : ut(pe(a), 0), we(function(g) {
          var Q = g[a], x = oi(g, 0, a);
          return Q && Y(x, Q), u(r, this, x);
        });
      }
      function oU(r, a, g) {
        var Q = !0, x = !0;
        if (typeof r != "function")
          throw new wt(l);
        return Je(g) && (Q = "leading" in g ? !!g.leading : Q, x = "trailing" in g ? !!g.trailing : x), lB(r, a, {
          leading: Q,
          maxWait: a,
          trailing: x
        });
      }
      function sU(r) {
        return iB(r, 1);
      }
      function uU(r, a) {
        return $f(Ef(a), r);
      }
      function lU() {
        if (!arguments.length)
          return [];
        var r = arguments[0];
        return le(r) ? r : [r];
      }
      function cU(r) {
        return hn(r, v);
      }
      function fU(r, a) {
        return a = typeof a == "function" ? a : t, hn(r, v, a);
      }
      function hU(r) {
        return hn(r, B | v);
      }
      function dU(r, a) {
        return a = typeof a == "function" ? a : t, hn(r, B | v, a);
      }
      function pU(r, a) {
        return a == null || Yp(r, a, dt(a));
      }
      function On(r, a) {
        return r === a || r !== r && a !== a;
      }
      var gU = Ou(pf), BU = Ou(function(r, a) {
        return r >= a;
      }), Ki = rg(/* @__PURE__ */ function() {
        return arguments;
      }()) ? rg : function(r) {
        return je(r) && Se.call(r, "callee") && !Ae.call(r, "callee");
      }, le = sA.isArray, wU = Co ? Ke(Co) : bC;
      function Wt(r) {
        return r != null && Vu(r.length) && !_r(r);
      }
      function et(r) {
        return je(r) && Wt(r);
      }
      function mU(r) {
        return r === !0 || r === !1 || je(r) && Pt(r) == _A;
      }
      var si = Ly || Ah, vU = ma ? Ke(ma) : EC;
      function yU(r) {
        return je(r) && r.nodeType === 1 && !ko(r);
      }
      function CU(r) {
        if (r == null)
          return !0;
        if (Wt(r) && (le(r) || typeof r == "string" || typeof r.splice == "function" || si(r) || Ia(r) || Ki(r)))
          return !r.length;
        var a = Ht(r);
        if (a == eA || a == he)
          return !r.size;
        if (Ko(r))
          return !wf(r).length;
        for (var g in r)
          if (Se.call(r, g))
            return !1;
        return !0;
      }
      function QU(r, a) {
        return No(r, a);
      }
      function FU(r, a, g) {
        g = typeof g == "function" ? g : t;
        var Q = g ? g(r, a) : t;
        return Q === t ? No(r, a, t, g) : !!Q;
      }
      function Gf(r) {
        if (!je(r))
          return !1;
        var a = Pt(r);
        return a == X || a == JA || typeof r.message == "string" && typeof r.name == "string" && !ko(r);
      }
      function UU(r) {
        return typeof r == "number" && Wp(r);
      }
      function _r(r) {
        if (!Je(r))
          return !1;
        var a = Pt(r);
        return a == V || a == k || a == bA || a == xe;
      }
      function fB(r) {
        return typeof r == "number" && r == pe(r);
      }
      function Vu(r) {
        return typeof r == "number" && r > -1 && r % 1 == 0 && r <= IA;
      }
      function Je(r) {
        var a = typeof r;
        return r != null && (a == "object" || a == "function");
      }
      function je(r) {
        return r != null && typeof r == "object";
      }
      var hB = Qo ? Ke(Qo) : xC;
      function bU(r, a) {
        return r === a || Bf(r, a, Tf(a));
      }
      function EU(r, a, g) {
        return g = typeof g == "function" ? g : t, Bf(r, a, Tf(a), g);
      }
      function _U(r) {
        return dB(r) && r != +r;
      }
      function xU(r) {
        if (fQ(r))
          throw new ie(s);
        return ig(r);
      }
      function IU(r) {
        return r === null;
      }
      function HU(r) {
        return r == null;
      }
      function dB(r) {
        return typeof r == "number" || je(r) && Pt(r) == lA;
      }
      function ko(r) {
        if (!je(r) || Pt(r) != jA)
          return !1;
        var a = ne(r);
        if (a === null)
          return !0;
        var g = Se.call(a, "constructor") && a.constructor;
        return typeof g == "function" && g instanceof g && ni.call(g) == Z;
      }
      var Vf = Fo ? Ke(Fo) : IC;
      function SU(r) {
        return fB(r) && r >= -IA && r <= IA;
      }
      var pB = pu ? Ke(pu) : HC;
      function Wu(r) {
        return typeof r == "string" || !le(r) && je(r) && Pt(r) == Te;
      }
      function tn(r) {
        return typeof r == "symbol" || je(r) && Pt(r) == ce;
      }
      var Ia = gu ? Ke(gu) : SC;
      function LU(r) {
        return r === t;
      }
      function TU(r) {
        return je(r) && Ht(r) == Ft;
      }
      function DU(r) {
        return je(r) && Pt(r) == Ot;
      }
      var OU = Ou(mf), NU = Ou(function(r, a) {
        return r <= a;
      });
      function gB(r) {
        if (!r)
          return [];
        if (Wt(r))
          return Wu(r) ? Bt(r) : Vt(r);
        if (qA && r[qA])
          return ya(r[qA]());
        var a = Ht(r), g = a == eA ? Eo : a == he ? Ca : Ha;
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
      function pe(r) {
        var a = xr(r), g = a % 1;
        return a === a ? g ? a - g : a : 0;
      }
      function BB(r) {
        return r ? Oi(pe(r), 0, T) : 0;
      }
      function gn(r) {
        if (typeof r == "number")
          return r;
        if (tn(r))
          return uA;
        if (Je(r)) {
          var a = typeof r.valueOf == "function" ? r.valueOf() : r;
          r = Je(a) ? a + "" : a;
        }
        if (typeof r != "string")
          return r === 0 ? r : +r;
        r = Hn(r);
        var g = kc.test(r);
        return g || po.test(r) ? hu(r.slice(2), g ? 2 : 8) : zn.test(r) ? uA : +r;
      }
      function wB(r) {
        return tr(r, Xt(r));
      }
      function MU(r) {
        return r ? Oi(pe(r), -IA, IA) : r === 0 ? r : 0;
      }
      function Oe(r) {
        return r == null ? "" : en(r);
      }
      var PU = Ea(function(r, a) {
        if (Ko(a) || Wt(a)) {
          tr(a, dt(a), r);
          return;
        }
        for (var g in a)
          Se.call(a, g) && To(r, g, a[g]);
      }), mB = Ea(function(r, a) {
        tr(a, Xt(a), r);
      }), Xu = Ea(function(r, a, g, Q) {
        tr(a, Xt(a), r, Q);
      }), KU = Ea(function(r, a, g, Q) {
        tr(a, dt(a), r, Q);
      }), RU = br(ff);
      function kU(r, a) {
        var g = ba(r);
        return a == null ? g : jp(g, a);
      }
      var $U = we(function(r, a) {
        r = be(r);
        var g = -1, Q = a.length, x = Q > 2 ? a[2] : t;
        for (x && Kt(a[0], a[1], x) && (Q = 1); ++g < Q; )
          for (var O = a[g], $ = Xt(O), W = -1, tA = $.length; ++W < tA; ) {
            var mA = $[W], vA = r[mA];
            (vA === t || On(vA, ti[mA]) && !Se.call(r, mA)) && (r[mA] = O[mA]);
          }
        return r;
      }), GU = we(function(r) {
        return r.push(t, Og), u(vB, t, r);
      });
      function VU(r, a) {
        return oe(r, YA(a, 3), er);
      }
      function WU(r, a) {
        return oe(r, YA(a, 3), df);
      }
      function XU(r, a) {
        return r == null ? r : hf(r, YA(a, 3), Xt);
      }
      function qU(r, a) {
        return r == null ? r : tg(r, YA(a, 3), Xt);
      }
      function zU(r, a) {
        return r && er(r, YA(a, 3));
      }
      function JU(r, a) {
        return r && df(r, YA(a, 3));
      }
      function jU(r) {
        return r == null ? [] : _u(r, dt(r));
      }
      function YU(r) {
        return r == null ? [] : _u(r, Xt(r));
      }
      function Wf(r, a, g) {
        var Q = r == null ? t : Ni(r, a);
        return Q === t ? g : Q;
      }
      function ZU(r, a) {
        return r != null && Pg(r, a, CC);
      }
      function Xf(r, a) {
        return r != null && Pg(r, a, QC);
      }
      var Ab = Hg(function(r, a, g) {
        a != null && typeof a.toString != "function" && (a = G.call(a)), r[a] = g;
      }, zf(qt)), eb = Hg(function(r, a, g) {
        a != null && typeof a.toString != "function" && (a = G.call(a)), Se.call(r, a) ? r[a].push(g) : r[a] = [g];
      }, YA), tb = we(Oo);
      function dt(r) {
        return Wt(r) ? zp(r) : wf(r);
      }
      function Xt(r) {
        return Wt(r) ? zp(r, !0) : LC(r);
      }
      function nb(r, a) {
        var g = {};
        return a = YA(a, 3), er(r, function(Q, x, O) {
          Fr(g, a(Q, x, O), Q);
        }), g;
      }
      function rb(r, a) {
        var g = {};
        return a = YA(a, 3), er(r, function(Q, x, O) {
          Fr(g, x, a(Q, x, O));
        }), g;
      }
      var ib = Ea(function(r, a, g) {
        xu(r, a, g);
      }), vB = Ea(function(r, a, g, Q) {
        xu(r, a, g, Q);
      }), ab = br(function(r, a) {
        var g = {};
        if (r == null)
          return g;
        var Q = !1;
        a = z(a, function(O) {
          return O = ai(O, r), Q || (Q = O.length > 1), O;
        }), tr(r, Sf(r), g), Q && (g = hn(g, B | p | v, AQ));
        for (var x = a.length; x--; )
          Ff(g, a[x]);
        return g;
      });
      function ob(r, a) {
        return yB(r, Gu(YA(a)));
      }
      var sb = br(function(r, a) {
        return r == null ? {} : DC(r, a);
      });
      function yB(r, a) {
        if (r == null)
          return {};
        var g = z(Sf(r), function(Q) {
          return [Q];
        });
        return a = YA(a), fg(r, g, function(Q, x) {
          return a(Q, x[0]);
        });
      }
      function ub(r, a, g) {
        a = ai(a, r);
        var Q = -1, x = a.length;
        for (x || (x = 1, r = t); ++Q < x; ) {
          var O = r == null ? t : r[nr(a[Q])];
          O === t && (Q = x, O = g), r = _r(O) ? O.call(r) : O;
        }
        return r;
      }
      function lb(r, a, g) {
        return r == null ? r : Mo(r, a, g);
      }
      function cb(r, a, g, Q) {
        return Q = typeof Q == "function" ? Q : t, r == null ? r : Mo(r, a, g, Q);
      }
      var CB = Tg(dt), QB = Tg(Xt);
      function fb(r, a, g) {
        var Q = le(r), x = Q || si(r) || Ia(r);
        if (a = YA(a, 4), g == null) {
          var O = r && r.constructor;
          x ? g = Q ? new O() : [] : Je(r) ? g = _r(O) ? ba(ne(r)) : {} : g = {};
        }
        return (x ? m : er)(r, function($, W, tA) {
          return a(g, $, W, tA);
        }), g;
      }
      function hb(r, a) {
        return r == null ? !0 : Ff(r, a);
      }
      function db(r, a, g) {
        return r == null ? r : Bg(r, a, Ef(g));
      }
      function pb(r, a, g, Q) {
        return Q = typeof Q == "function" ? Q : t, r == null ? r : Bg(r, a, Ef(g), Q);
      }
      function Ha(r) {
        return r == null ? [] : xt(r, dt(r));
      }
      function gb(r) {
        return r == null ? [] : xt(r, Xt(r));
      }
      function Bb(r, a, g) {
        return g === t && (g = a, a = t), g !== t && (g = gn(g), g = g === g ? g : 0), a !== t && (a = gn(a), a = a === a ? a : 0), Oi(gn(r), a, g);
      }
      function wb(r, a, g) {
        return a = xr(a), g === t ? (g = a, a = 0) : g = xr(g), r = gn(r), FC(r, a, g);
      }
      function mb(r, a, g) {
        if (g && typeof g != "boolean" && Kt(r, a, g) && (a = g = t), g === t && (typeof a == "boolean" ? (g = a, a = t) : typeof r == "boolean" && (g = r, r = t)), r === t && a === t ? (r = 0, a = 1) : (r = xr(r), a === t ? (a = r, r = 0) : a = xr(a)), r > a) {
          var Q = r;
          r = a, a = Q;
        }
        if (g || r % 1 || a % 1) {
          var x = Xp();
          return It(r + x * (a - r + ef("1e-" + ((x + "").length - 1))), a);
        }
        return yf(r, a);
      }
      var vb = _a(function(r, a, g) {
        return a = a.toLowerCase(), r + (g ? FB(a) : a);
      });
      function FB(r) {
        return qf(Oe(r).toLowerCase());
      }
      function UB(r) {
        return r = Oe(r), r && r.replace(Gc, bo).replace(uu, "");
      }
      function yb(r, a, g) {
        r = Oe(r), a = en(a);
        var Q = r.length;
        g = g === t ? Q : Oi(pe(g), 0, Q);
        var x = g;
        return g -= a.length, g >= 0 && r.slice(g, x) == a;
      }
      function Cb(r) {
        return r = Oe(r), r && Ui.test(r) ? r.replace(Fi, De) : r;
      }
      function Qb(r) {
        return r = Oe(r), r && gr.test(r) ? r.replace(co, "\\$&") : r;
      }
      var Fb = _a(function(r, a, g) {
        return r + (g ? "-" : "") + a.toLowerCase();
      }), Ub = _a(function(r, a, g) {
        return r + (g ? " " : "") + a.toLowerCase();
      }), bb = _g("toLowerCase");
      function Eb(r, a, g) {
        r = Oe(r), a = pe(a);
        var Q = a ? Ai(r) : 0;
        if (!a || Q >= a)
          return r;
        var x = (a - Q) / 2;
        return Du(ht(x), g) + r + Du(Ar(x), g);
      }
      function _b(r, a, g) {
        r = Oe(r), a = pe(a);
        var Q = a ? Ai(r) : 0;
        return a && Q < a ? r + Du(a - Q, g) : r;
      }
      function xb(r, a, g) {
        r = Oe(r), a = pe(a);
        var Q = a ? Ai(r) : 0;
        return a && Q < a ? Du(a - Q, g) + r : r;
      }
      function Ib(r, a, g) {
        return g || a == null ? a = 0 : a && (a = +a), Ny(Oe(r).replace(sa, ""), a || 0);
      }
      function Hb(r, a, g) {
        return (g ? Kt(r, a, g) : a === t) ? a = 1 : a = pe(a), Cf(Oe(r), a);
      }
      function Sb() {
        var r = arguments, a = Oe(r[0]);
        return r.length < 3 ? a : a.replace(r[1], r[2]);
      }
      var Lb = _a(function(r, a, g) {
        return r + (g ? "_" : "") + a.toLowerCase();
      });
      function Tb(r, a, g) {
        return g && typeof g != "number" && Kt(r, a, g) && (a = g = t), g = g === t ? T : g >>> 0, g ? (r = Oe(r), r && (typeof a == "string" || a != null && !Vf(a)) && (a = en(a), !a && Yn(r)) ? oi(Bt(r), 0, g) : r.split(a, g)) : [];
      }
      var Db = _a(function(r, a, g) {
        return r + (g ? " " : "") + qf(a);
      });
      function Ob(r, a, g) {
        return r = Oe(r), g = g == null ? 0 : Oi(pe(g), 0, r.length), a = en(a), r.slice(g, g + a.length) == a;
      }
      function Nb(r, a, g) {
        var Q = L.templateSettings;
        g && Kt(r, a, g) && (a = t), r = Oe(r), a = Xu({}, a, Q, Dg);
        var x = Xu({}, a.imports, Q.imports, Dg), O = dt(x), $ = xt(x, O), W, tA, mA = 0, vA = a.interpolate || ca, xA = "__p += '", DA = Si(
          (a.escape || ca).source + "|" + vA.source + "|" + (vA === bi ? Xs : ca).source + "|" + (a.evaluate || ca).source + "|$",
          "g"
        ), $A = "//# sourceURL=" + (Se.call(a, "sourceURL") ? (a.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++fu + "]") + `
`;
        r.replace(DA, function(te, Qe, Ee, nn, Rt, rn) {
          return Ee || (Ee = nn), xA += r.slice(mA, rn).replace(Vc, vr), Qe && (W = !0, xA += `' +
__e(` + Qe + `) +
'`), Rt && (tA = !0, xA += `';
` + Rt + `;
__p += '`), Ee && (xA += `' +
((__t = (` + Ee + `)) == null ? '' : __t) +
'`), mA = rn + te.length, te;
        }), xA += `';
`;
        var ee = Se.call(a, "variable") && a.variable;
        if (!ee)
          xA = `with (obj) {
` + xA + `
}
`;
        else if (la.test(ee))
          throw new ie(f);
        xA = (tA ? xA.replace(Ce, "") : xA).replace(at, "$1").replace(bt, "$1;"), xA = "function(" + (ee || "obj") + `) {
` + (ee ? "" : `obj || (obj = {});
`) + "var __t, __p = ''" + (W ? ", __e = _.escape" : "") + (tA ? `, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
` : `;
`) + xA + `return __p
}`;
        var Be = EB(function() {
          return He(O, $A + "return " + xA).apply(t, $);
        });
        if (Be.source = xA, Gf(Be))
          throw Be;
        return Be;
      }
      function Mb(r) {
        return Oe(r).toLowerCase();
      }
      function Pb(r) {
        return Oe(r).toUpperCase();
      }
      function Kb(r, a, g) {
        if (r = Oe(r), r && (g || a === t))
          return Hn(r);
        if (!r || !(a = en(a)))
          return r;
        var Q = Bt(r), x = Bt(a), O = Sn(Q, x), $ = Uo(Q, x) + 1;
        return oi(Q, O, $).join("");
      }
      function Rb(r, a, g) {
        if (r = Oe(r), r && (g || a === t))
          return r.slice(0, vu(r) + 1);
        if (!r || !(a = en(a)))
          return r;
        var Q = Bt(r), x = Uo(Q, Bt(a)) + 1;
        return oi(Q, 0, x).join("");
      }
      function kb(r, a, g) {
        if (r = Oe(r), r && (g || a === t))
          return r.replace(sa, "");
        if (!r || !(a = en(a)))
          return r;
        var Q = Bt(r), x = Sn(Q, Bt(a));
        return oi(Q, x).join("");
      }
      function $b(r, a) {
        var g = wA, Q = QA;
        if (Je(a)) {
          var x = "separator" in a ? a.separator : x;
          g = "length" in a ? pe(a.length) : g, Q = "omission" in a ? en(a.omission) : Q;
        }
        r = Oe(r);
        var O = r.length;
        if (Yn(r)) {
          var $ = Bt(r);
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
      function Gb(r) {
        return r = Oe(r), r && bn.test(r) ? r.replace(Un, _o) : r;
      }
      var Vb = _a(function(r, a, g) {
        return r + (g ? " " : "") + a.toUpperCase();
      }), qf = _g("toUpperCase");
      function bB(r, a, g) {
        return r = Oe(r), a = g ? t : a, a === t ? nf(r) ? Tn(r) : ZA(r) : r.match(a) || [];
      }
      var EB = we(function(r, a) {
        try {
          return u(r, t, a);
        } catch (g) {
          return Gf(g) ? g : new ie(g);
        }
      }), Wb = br(function(r, a) {
        return m(a, function(g) {
          g = nr(g), Fr(r, g, kf(r[g], r));
        }), r;
      });
      function Xb(r) {
        var a = r == null ? 0 : r.length, g = YA();
        return r = a ? z(r, function(Q) {
          if (typeof Q[1] != "function")
            throw new wt(l);
          return [g(Q[0]), Q[1]];
        }) : [], we(function(Q) {
          for (var x = -1; ++x < a; ) {
            var O = r[x];
            if (u(O[0], this, Q))
              return u(O[1], this, Q);
          }
        });
      }
      function qb(r) {
        return mC(hn(r, B));
      }
      function zf(r) {
        return function() {
          return r;
        };
      }
      function zb(r, a) {
        return r == null || r !== r ? a : r;
      }
      var Jb = Ig(), jb = Ig(!0);
      function qt(r) {
        return r;
      }
      function Jf(r) {
        return ag(typeof r == "function" ? r : hn(r, B));
      }
      function Yb(r) {
        return sg(hn(r, B));
      }
      function Zb(r, a) {
        return ug(r, hn(a, B));
      }
      var AE = we(function(r, a) {
        return function(g) {
          return Oo(g, r, a);
        };
      }), eE = we(function(r, a) {
        return function(g) {
          return Oo(r, g, a);
        };
      });
      function jf(r, a, g) {
        var Q = dt(a), x = _u(a, Q);
        g == null && !(Je(a) && (x.length || !Q.length)) && (g = a, a = r, r = this, x = _u(a, dt(a)));
        var O = !(Je(g) && "chain" in g) || !!g.chain, $ = _r(r);
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
      function tE() {
        return Ye._ === this && (Ye._ = dA), this;
      }
      function Yf() {
      }
      function nE(r) {
        return r = pe(r), we(function(a) {
          return lg(a, r);
        });
      }
      var rE = xf(z), iE = xf(b), aE = xf(LA);
      function _B(r) {
        return Of(r) ? ue(nr(r)) : OC(r);
      }
      function oE(r) {
        return function(a) {
          return r == null ? t : Ni(r, a);
        };
      }
      var sE = Sg(), uE = Sg(!0);
      function Zf() {
        return [];
      }
      function Ah() {
        return !1;
      }
      function lE() {
        return {};
      }
      function cE() {
        return "";
      }
      function fE() {
        return !0;
      }
      function hE(r, a) {
        if (r = pe(r), r < 1 || r > IA)
          return [];
        var g = T, Q = It(r, T);
        a = YA(a), r -= T;
        for (var x = In(Q, a); ++g < r; )
          a(g);
        return x;
      }
      function dE(r) {
        return le(r) ? z(r, nr) : tn(r) ? [r] : Vt(qg(Oe(r)));
      }
      function pE(r) {
        var a = ++of;
        return Oe(r) + a;
      }
      var gE = Tu(function(r, a) {
        return r + a;
      }, 0), BE = If("ceil"), wE = Tu(function(r, a) {
        return r / a;
      }, 1), mE = If("floor");
      function vE(r) {
        return r && r.length ? Eu(r, qt, pf) : t;
      }
      function yE(r, a) {
        return r && r.length ? Eu(r, YA(a, 2), pf) : t;
      }
      function CE(r) {
        return st(r, qt);
      }
      function QE(r, a) {
        return st(r, YA(a, 2));
      }
      function FE(r) {
        return r && r.length ? Eu(r, qt, mf) : t;
      }
      function UE(r, a) {
        return r && r.length ? Eu(r, YA(a, 2), mf) : t;
      }
      var bE = Tu(function(r, a) {
        return r * a;
      }, 1), EE = If("round"), _E = Tu(function(r, a) {
        return r - a;
      }, 0);
      function xE(r) {
        return r && r.length ? _t(r, qt) : 0;
      }
      function IE(r, a) {
        return r && r.length ? _t(r, YA(a, 2)) : 0;
      }
      return L.after = YF, L.ary = iB, L.assign = PU, L.assignIn = mB, L.assignInWith = Xu, L.assignWith = KU, L.at = RU, L.before = aB, L.bind = kf, L.bindAll = Wb, L.bindKey = oB, L.castArray = lU, L.chain = tB, L.chunk = mQ, L.compact = vQ, L.concat = yQ, L.cond = Xb, L.conforms = qb, L.constant = zf, L.countBy = xF, L.create = kU, L.curry = sB, L.curryRight = uB, L.debounce = lB, L.defaults = $U, L.defaultsDeep = GU, L.defer = ZF, L.delay = AU, L.difference = CQ, L.differenceBy = QQ, L.differenceWith = FQ, L.drop = UQ, L.dropRight = bQ, L.dropRightWhile = EQ, L.dropWhile = _Q, L.fill = xQ, L.filter = HF, L.flatMap = TF, L.flatMapDeep = DF, L.flatMapDepth = OF, L.flatten = Yg, L.flattenDeep = IQ, L.flattenDepth = HQ, L.flip = eU, L.flow = Jb, L.flowRight = jb, L.fromPairs = SQ, L.functions = jU, L.functionsIn = YU, L.groupBy = NF, L.initial = TQ, L.intersection = DQ, L.intersectionBy = OQ, L.intersectionWith = NQ, L.invert = Ab, L.invertBy = eb, L.invokeMap = PF, L.iteratee = Jf, L.keyBy = KF, L.keys = dt, L.keysIn = Xt, L.map = Ru, L.mapKeys = nb, L.mapValues = rb, L.matches = Yb, L.matchesProperty = Zb, L.memoize = $u, L.merge = ib, L.mergeWith = vB, L.method = AE, L.methodOf = eE, L.mixin = jf, L.negate = Gu, L.nthArg = nE, L.omit = ab, L.omitBy = ob, L.once = tU, L.orderBy = RF, L.over = rE, L.overArgs = nU, L.overEvery = iE, L.overSome = aE, L.partial = $f, L.partialRight = cB, L.partition = kF, L.pick = sb, L.pickBy = yB, L.property = _B, L.propertyOf = oE, L.pull = RQ, L.pullAll = AB, L.pullAllBy = kQ, L.pullAllWith = $Q, L.pullAt = GQ, L.range = sE, L.rangeRight = uE, L.rearg = rU, L.reject = VF, L.remove = VQ, L.rest = iU, L.reverse = Kf, L.sampleSize = XF, L.set = lb, L.setWith = cb, L.shuffle = qF, L.slice = WQ, L.sortBy = jF, L.sortedUniq = ZQ, L.sortedUniqBy = AF, L.split = Tb, L.spread = aU, L.tail = eF, L.take = tF, L.takeRight = nF, L.takeRightWhile = rF, L.takeWhile = iF, L.tap = vF, L.throttle = oU, L.thru = Ku, L.toArray = gB, L.toPairs = CB, L.toPairsIn = QB, L.toPath = dE, L.toPlainObject = wB, L.transform = fb, L.unary = sU, L.union = aF, L.unionBy = oF, L.unionWith = sF, L.uniq = uF, L.uniqBy = lF, L.uniqWith = cF, L.unset = hb, L.unzip = Rf, L.unzipWith = eB, L.update = db, L.updateWith = pb, L.values = Ha, L.valuesIn = gb, L.without = fF, L.words = bB, L.wrap = uU, L.xor = hF, L.xorBy = dF, L.xorWith = pF, L.zip = gF, L.zipObject = BF, L.zipObjectDeep = wF, L.zipWith = mF, L.entries = CB, L.entriesIn = QB, L.extend = mB, L.extendWith = Xu, jf(L, L), L.add = gE, L.attempt = EB, L.camelCase = vb, L.capitalize = FB, L.ceil = BE, L.clamp = Bb, L.clone = cU, L.cloneDeep = hU, L.cloneDeepWith = dU, L.cloneWith = fU, L.conformsTo = pU, L.deburr = UB, L.defaultTo = zb, L.divide = wE, L.endsWith = yb, L.eq = On, L.escape = Cb, L.escapeRegExp = Qb, L.every = IF, L.find = SF, L.findIndex = Jg, L.findKey = VU, L.findLast = LF, L.findLastIndex = jg, L.findLastKey = WU, L.floor = mE, L.forEach = nB, L.forEachRight = rB, L.forIn = XU, L.forInRight = qU, L.forOwn = zU, L.forOwnRight = JU, L.get = Wf, L.gt = gU, L.gte = BU, L.has = ZU, L.hasIn = Xf, L.head = Zg, L.identity = qt, L.includes = MF, L.indexOf = LQ, L.inRange = wb, L.invoke = tb, L.isArguments = Ki, L.isArray = le, L.isArrayBuffer = wU, L.isArrayLike = Wt, L.isArrayLikeObject = et, L.isBoolean = mU, L.isBuffer = si, L.isDate = vU, L.isElement = yU, L.isEmpty = CU, L.isEqual = QU, L.isEqualWith = FU, L.isError = Gf, L.isFinite = UU, L.isFunction = _r, L.isInteger = fB, L.isLength = Vu, L.isMap = hB, L.isMatch = bU, L.isMatchWith = EU, L.isNaN = _U, L.isNative = xU, L.isNil = HU, L.isNull = IU, L.isNumber = dB, L.isObject = Je, L.isObjectLike = je, L.isPlainObject = ko, L.isRegExp = Vf, L.isSafeInteger = SU, L.isSet = pB, L.isString = Wu, L.isSymbol = tn, L.isTypedArray = Ia, L.isUndefined = LU, L.isWeakMap = TU, L.isWeakSet = DU, L.join = MQ, L.kebabCase = Fb, L.last = pn, L.lastIndexOf = PQ, L.lowerCase = Ub, L.lowerFirst = bb, L.lt = OU, L.lte = NU, L.max = vE, L.maxBy = yE, L.mean = CE, L.meanBy = QE, L.min = FE, L.minBy = UE, L.stubArray = Zf, L.stubFalse = Ah, L.stubObject = lE, L.stubString = cE, L.stubTrue = fE, L.multiply = bE, L.nth = KQ, L.noConflict = tE, L.noop = Yf, L.now = ku, L.pad = Eb, L.padEnd = _b, L.padStart = xb, L.parseInt = Ib, L.random = mb, L.reduce = $F, L.reduceRight = GF, L.repeat = Hb, L.replace = Sb, L.result = ub, L.round = EE, L.runInContext = AA, L.sample = WF, L.size = zF, L.snakeCase = Lb, L.some = JF, L.sortedIndex = XQ, L.sortedIndexBy = qQ, L.sortedIndexOf = zQ, L.sortedLastIndex = JQ, L.sortedLastIndexBy = jQ, L.sortedLastIndexOf = YQ, L.startCase = Db, L.startsWith = Ob, L.subtract = _E, L.sum = xE, L.sumBy = IE, L.template = Nb, L.times = hE, L.toFinite = xr, L.toInteger = pe, L.toLength = BB, L.toLower = Mb, L.toNumber = gn, L.toSafeInteger = MU, L.toString = Oe, L.toUpper = Pb, L.trim = Kb, L.trimEnd = Rb, L.trimStart = kb, L.truncate = $b, L.unescape = Gb, L.uniqueId = pE, L.upperCase = Vb, L.upperFirst = qf, L.each = nB, L.eachRight = rB, L.first = Zg, jf(L, function() {
        var r = {};
        return er(L, function(a, g) {
          Se.call(L.prototype, g) || (r[g] = a);
        }), r;
      }(), { chain: !1 }), L.VERSION = n, m(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(r) {
        L[r].placeholder = L;
      }), m(["drop", "take"], function(r, a) {
        Fe.prototype[r] = function(g) {
          g = g === t ? 1 : ut(pe(g), 0);
          var Q = this.__filtered__ && !a ? new Fe(this) : this.clone();
          return Q.__filtered__ ? Q.__takeCount__ = It(g, Q.__takeCount__) : Q.__views__.push({
            size: It(g, T),
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
            iteratee: YA(x, 3),
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
      }, Fe.prototype.invokeMap = we(function(r, a) {
        return typeof r == "function" ? new Fe(this) : this.map(function(g) {
          return Oo(g, r, a);
        });
      }), Fe.prototype.reject = function(r) {
        return this.filter(Gu(YA(r)));
      }, Fe.prototype.slice = function(r, a) {
        r = pe(r);
        var g = this;
        return g.__filtered__ && (r > 0 || a < 0) ? new Fe(g) : (r < 0 ? g = g.takeRight(-r) : r && (g = g.drop(r)), a !== t && (a = pe(a), g = a < 0 ? g.dropRight(-a) : g.take(a - r)), g);
      }, Fe.prototype.takeRightWhile = function(r) {
        return this.reverse().takeWhile(r).reverse();
      }, Fe.prototype.toArray = function() {
        return this.take(T);
      }, er(Fe.prototype, function(r, a) {
        var g = /^(?:filter|find|map|reject)|While$/.test(a), Q = /^(?:head|last)$/.test(a), x = L[Q ? "take" + (a == "last" ? "Right" : "") : a], O = Q || /^find/.test(a);
        x && (L.prototype[a] = function() {
          var $ = this.__wrapped__, W = Q ? [1] : arguments, tA = $ instanceof Fe, mA = W[0], vA = tA || le($), xA = function(Qe) {
            var Ee = x.apply(L, Y([Qe], W));
            return Q && DA ? Ee[0] : Ee;
          };
          vA && g && typeof mA == "function" && mA.length != 1 && (tA = vA = !1);
          var DA = this.__chain__, $A = !!this.__actions__.length, ee = O && !DA, Be = tA && !$A;
          if (!O && vA) {
            $ = Be ? $ : new Fe(this);
            var te = r.apply($, W);
            return te.__actions__.push({ func: Ku, args: [xA], thisArg: t }), new fn(te, DA);
          }
          return ee && Be ? r.apply(this, W) : (te = this.thru(xA), ee ? Q ? te.value()[0] : te.value() : te);
        });
      }), m(["pop", "push", "shift", "sort", "splice", "unshift"], function(r) {
        var a = ei[r], g = /^(?:push|sort|unshift)$/.test(r) ? "tap" : "thru", Q = /^(?:pop|shift)$/.test(r);
        L.prototype[r] = function() {
          var x = arguments;
          if (Q && !this.__chain__) {
            var O = this.value();
            return a.apply(le(O) ? O : [], x);
          }
          return this[g](function($) {
            return a.apply(le($) ? $ : [], x);
          });
        };
      }), er(Fe.prototype, function(r, a) {
        var g = L[a];
        if (g) {
          var Q = g.name + "";
          Se.call(Ua, Q) || (Ua[Q] = []), Ua[Q].push({ name: a, func: g });
        }
      }), Ua[Lu(t, U).name] = [{
        name: "wrapper",
        func: t
      }], Fe.prototype.clone = Gy, Fe.prototype.reverse = Vy, Fe.prototype.value = Wy, L.prototype.at = yF, L.prototype.chain = CF, L.prototype.commit = QF, L.prototype.next = FF, L.prototype.plant = bF, L.prototype.reverse = EF, L.prototype.toJSON = L.prototype.valueOf = L.prototype.value = _F, L.prototype.first = L.prototype.head, qA && (L.prototype[qA] = UF), L;
    }, Ie = yu();
    cn ? ((cn.exports = Ie)._ = Ie, yo._ = Ie) : Ye._ = Ie;
  }).call(Wi);
})(jl, jl.exports);
var AH = jl.exports;
const _e = /* @__PURE__ */ vc(AH), eH = function(A) {
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
  }, t = _e.merge({}, e, A), n = function(i, s) {
    var l = _e.cloneDeep(i);
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
        s.chromosomes.map(function(E) {
          return E.length;
        })
      ), H = {
        label: _e.pick(t.annotations.label, ["size", "show"]),
        marker: _e.pick(t.annotations.marker, ["size", "show"])
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
      return s.chromosomes.length == 1 && (D.chromosomePosition.x = w.left + 0.5 * F, D.geneAnnotationPosition.x = w.left + 0.5 * F + o, D.qtlAnnotationPosition.width = F * 0.5, D.geneAnnotationPosition.width = F * 1.5, D.labelPosition.x = w.left + 0.5 * F, D.labelPosition.width = o, D.sizeLabelPosition.x = w.left + 0.5 * F, D.sizeLabelPosition.width = o), s.drawing = _e.pick(t, ["width", "height"]), s.drawing.margin = {
        top: t.margin.top * s.drawing.height,
        left: t.margin.left * s.drawing.width,
        bottom: t.margin.bottom * s.drawing.height,
        right: t.margin.right * s.drawing.width
      }, s.chromosomes.forEach(function(E, M) {
        var K = M % t.numberPerRow, J = Math.floor(M / t.numberPerRow);
        E.cell = {
          y: J * h.height + t.margin.top * t.height,
          x: K * h.width + t.margin.left * t.width,
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
      return arguments.length ? (t.margin = _e.merge(t.margin, i), this) : t.margin;
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
function tH(A, e) {
  return A == null || e == null ? NaN : e < A ? -1 : e > A ? 1 : e >= A ? 0 : NaN;
}
function _v(A) {
  let e, t, n;
  A.length !== 2 ? (e = Nl, t = (f, c) => Nl(A(f), c), n = (f, c) => A(f) - c) : (e = A === Nl || A === tH ? A : nH, t = A, n = A);
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
function nH() {
  return 0;
}
function rH(A) {
  return A === null ? NaN : +A;
}
const iH = _v(Nl), aH = iH.right;
_v(rH).center;
const oH = Math.sqrt(50), sH = Math.sqrt(10), uH = Math.sqrt(2);
function Yl(A, e, t) {
  const n = (e - A) / Math.max(0, t), i = Math.floor(Math.log10(n)), s = n / Math.pow(10, i), l = s >= oH ? 10 : s >= sH ? 5 : s >= uH ? 2 : 1;
  let f, c, h;
  return i < 0 ? (h = Math.pow(10, -i) / l, f = Math.round(A * h), c = Math.round(e * h), f / h < A && ++f, c / h > e && --c, h = -h) : (h = Math.pow(10, i) * l, f = Math.round(A / h), c = Math.round(e / h), f * h < A && ++f, c * h > e && --c), c < f && 0.5 <= t && t < 2 ? Yl(A, e, t * 2) : [f, c, h];
}
function lH(A, e, t) {
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
function cH(A, e, t) {
  e = +e, A = +A, t = +t;
  const n = e < A, i = n ? Gh(e, A, t) : Gh(A, e, t);
  return (n ? -1 : 1) * (i < 0 ? 1 / -i : i);
}
var fH = { value: function() {
} };
function Ec() {
  for (var A = 0, e = arguments.length, t = {}, n; A < e; ++A) {
    if (!(n = arguments[A] + "") || n in t || /[\s.]/.test(n)) throw new Error("illegal type: " + n);
    t[n] = [];
  }
  return new Ml(t);
}
function Ml(A) {
  this._ = A;
}
function hH(A, e) {
  return A.trim().split(/^|\s+/).map(function(t) {
    var n = "", i = t.indexOf(".");
    if (i >= 0 && (n = t.slice(i + 1), t = t.slice(0, i)), t && !e.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return { type: t, name: n };
  });
}
Ml.prototype = Ec.prototype = {
  constructor: Ml,
  on: function(A, e) {
    var t = this._, n = hH(A + "", t), i, s = -1, l = n.length;
    if (arguments.length < 2) {
      for (; ++s < l; ) if ((i = (A = n[s]).type) && (i = dH(t[i], A.name))) return i;
      return;
    }
    if (e != null && typeof e != "function") throw new Error("invalid callback: " + e);
    for (; ++s < l; )
      if (i = (A = n[s]).type) t[i] = nw(t[i], A.name, e);
      else if (e == null) for (i in t) t[i] = nw(t[i], A.name, null);
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
function dH(A, e) {
  for (var t = 0, n = A.length, i; t < n; ++t)
    if ((i = A[t]).name === e)
      return i.value;
}
function nw(A, e, t) {
  for (var n = 0, i = A.length; n < i; ++n)
    if (A[n].name === e) {
      A[n] = fH, A = A.slice(0, n).concat(A.slice(n + 1));
      break;
    }
  return t != null && A.push({ name: e, value: t }), A;
}
var Vh = "http://www.w3.org/1999/xhtml";
const rw = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: Vh,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function _c(A) {
  var e = A += "", t = e.indexOf(":");
  return t >= 0 && (e = A.slice(0, t)) !== "xmlns" && (A = A.slice(t + 1)), rw.hasOwnProperty(e) ? { space: rw[e], local: A } : A;
}
function pH(A) {
  return function() {
    var e = this.ownerDocument, t = this.namespaceURI;
    return t === Vh && e.documentElement.namespaceURI === Vh ? e.createElement(A) : e.createElementNS(t, A);
  };
}
function gH(A) {
  return function() {
    return this.ownerDocument.createElementNS(A.space, A.local);
  };
}
function xv(A) {
  var e = _c(A);
  return (e.local ? gH : pH)(e);
}
function BH() {
}
function vp(A) {
  return A == null ? BH : function() {
    return this.querySelector(A);
  };
}
function wH(A) {
  typeof A != "function" && (A = vp(A));
  for (var e = this._groups, t = e.length, n = new Array(t), i = 0; i < t; ++i)
    for (var s = e[i], l = s.length, f = n[i] = new Array(l), c, h, w = 0; w < l; ++w)
      (c = s[w]) && (h = A.call(c, c.__data__, w, s)) && ("__data__" in c && (h.__data__ = c.__data__), f[w] = h);
  return new $t(n, this._parents);
}
function Iv(A) {
  return A == null ? [] : Array.isArray(A) ? A : Array.from(A);
}
function mH() {
  return [];
}
function Hv(A) {
  return A == null ? mH : function() {
    return this.querySelectorAll(A);
  };
}
function vH(A) {
  return function() {
    return Iv(A.apply(this, arguments));
  };
}
function yH(A) {
  typeof A == "function" ? A = vH(A) : A = Hv(A);
  for (var e = this._groups, t = e.length, n = [], i = [], s = 0; s < t; ++s)
    for (var l = e[s], f = l.length, c, h = 0; h < f; ++h)
      (c = l[h]) && (n.push(A.call(c, c.__data__, h, l)), i.push(c));
  return new $t(n, i);
}
function Sv(A) {
  return function() {
    return this.matches(A);
  };
}
function Lv(A) {
  return function(e) {
    return e.matches(A);
  };
}
var CH = Array.prototype.find;
function QH(A) {
  return function() {
    return CH.call(this.children, A);
  };
}
function FH() {
  return this.firstElementChild;
}
function UH(A) {
  return this.select(A == null ? FH : QH(typeof A == "function" ? A : Lv(A)));
}
var bH = Array.prototype.filter;
function EH() {
  return Array.from(this.children);
}
function _H(A) {
  return function() {
    return bH.call(this.children, A);
  };
}
function xH(A) {
  return this.selectAll(A == null ? EH : _H(typeof A == "function" ? A : Lv(A)));
}
function IH(A) {
  typeof A != "function" && (A = Sv(A));
  for (var e = this._groups, t = e.length, n = new Array(t), i = 0; i < t; ++i)
    for (var s = e[i], l = s.length, f = n[i] = [], c, h = 0; h < l; ++h)
      (c = s[h]) && A.call(c, c.__data__, h, s) && f.push(c);
  return new $t(n, this._parents);
}
function Tv(A) {
  return new Array(A.length);
}
function HH() {
  return new $t(this._enter || this._groups.map(Tv), this._parents);
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
function SH(A) {
  return function() {
    return A;
  };
}
function LH(A, e, t, n, i, s) {
  for (var l = 0, f, c = e.length, h = s.length; l < h; ++l)
    (f = e[l]) ? (f.__data__ = s[l], n[l] = f) : t[l] = new Zl(A, s[l]);
  for (; l < c; ++l)
    (f = e[l]) && (i[l] = f);
}
function TH(A, e, t, n, i, s, l) {
  var f, c, h = /* @__PURE__ */ new Map(), w = e.length, B = s.length, p = new Array(w), v;
  for (f = 0; f < w; ++f)
    (c = e[f]) && (p[f] = v = l.call(c, c.__data__, f, e) + "", h.has(v) ? i[f] = c : h.set(v, c));
  for (f = 0; f < B; ++f)
    v = l.call(A, s[f], f, s) + "", (c = h.get(v)) ? (n[f] = c, c.__data__ = s[f], h.delete(v)) : t[f] = new Zl(A, s[f]);
  for (f = 0; f < w; ++f)
    (c = e[f]) && h.get(p[f]) === c && (i[f] = c);
}
function DH(A) {
  return A.__data__;
}
function OH(A, e) {
  if (!arguments.length) return Array.from(this, DH);
  var t = e ? TH : LH, n = this._parents, i = this._groups;
  typeof A != "function" && (A = SH(A));
  for (var s = i.length, l = new Array(s), f = new Array(s), c = new Array(s), h = 0; h < s; ++h) {
    var w = n[h], B = i[h], p = B.length, v = NH(A.call(w, w && w.__data__, h, n)), o = v.length, C = f[h] = new Array(o), F = l[h] = new Array(o), U = c[h] = new Array(p);
    t(w, B, C, F, U, v, e);
    for (var H = 0, D = 0, E, M; H < o; ++H)
      if (E = C[H]) {
        for (H >= D && (D = H + 1); !(M = F[D]) && ++D < o; ) ;
        E._next = M || null;
      }
  }
  return l = new $t(l, n), l._enter = f, l._exit = c, l;
}
function NH(A) {
  return typeof A == "object" && "length" in A ? A : Array.from(A);
}
function MH() {
  return new $t(this._exit || this._groups.map(Tv), this._parents);
}
function PH(A, e, t) {
  var n = this.enter(), i = this, s = this.exit();
  return typeof A == "function" ? (n = A(n), n && (n = n.selection())) : n = n.append(A + ""), e != null && (i = e(i), i && (i = i.selection())), t == null ? s.remove() : t(s), n && i ? n.merge(i).order() : i;
}
function KH(A) {
  for (var e = A.selection ? A.selection() : A, t = this._groups, n = e._groups, i = t.length, s = n.length, l = Math.min(i, s), f = new Array(i), c = 0; c < l; ++c)
    for (var h = t[c], w = n[c], B = h.length, p = f[c] = new Array(B), v, o = 0; o < B; ++o)
      (v = h[o] || w[o]) && (p[o] = v);
  for (; c < i; ++c)
    f[c] = t[c];
  return new $t(f, this._parents);
}
function RH() {
  for (var A = this._groups, e = -1, t = A.length; ++e < t; )
    for (var n = A[e], i = n.length - 1, s = n[i], l; --i >= 0; )
      (l = n[i]) && (s && l.compareDocumentPosition(s) ^ 4 && s.parentNode.insertBefore(l, s), s = l);
  return this;
}
function kH(A) {
  A || (A = $H);
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
function $H(A, e) {
  return A < e ? -1 : A > e ? 1 : A >= e ? 0 : NaN;
}
function GH() {
  var A = arguments[0];
  return arguments[0] = this, A.apply(null, arguments), this;
}
function VH() {
  return Array.from(this);
}
function WH() {
  for (var A = this._groups, e = 0, t = A.length; e < t; ++e)
    for (var n = A[e], i = 0, s = n.length; i < s; ++i) {
      var l = n[i];
      if (l) return l;
    }
  return null;
}
function XH() {
  let A = 0;
  for (const e of this) ++A;
  return A;
}
function qH() {
  return !this.node();
}
function zH(A) {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var i = e[t], s = 0, l = i.length, f; s < l; ++s)
      (f = i[s]) && A.call(f, f.__data__, s, i);
  return this;
}
function JH(A) {
  return function() {
    this.removeAttribute(A);
  };
}
function jH(A) {
  return function() {
    this.removeAttributeNS(A.space, A.local);
  };
}
function YH(A, e) {
  return function() {
    this.setAttribute(A, e);
  };
}
function ZH(A, e) {
  return function() {
    this.setAttributeNS(A.space, A.local, e);
  };
}
function AS(A, e) {
  return function() {
    var t = e.apply(this, arguments);
    t == null ? this.removeAttribute(A) : this.setAttribute(A, t);
  };
}
function eS(A, e) {
  return function() {
    var t = e.apply(this, arguments);
    t == null ? this.removeAttributeNS(A.space, A.local) : this.setAttributeNS(A.space, A.local, t);
  };
}
function tS(A, e) {
  var t = _c(A);
  if (arguments.length < 2) {
    var n = this.node();
    return t.local ? n.getAttributeNS(t.space, t.local) : n.getAttribute(t);
  }
  return this.each((e == null ? t.local ? jH : JH : typeof e == "function" ? t.local ? eS : AS : t.local ? ZH : YH)(t, e));
}
function Dv(A) {
  return A.ownerDocument && A.ownerDocument.defaultView || A.document && A || A.defaultView;
}
function nS(A) {
  return function() {
    this.style.removeProperty(A);
  };
}
function rS(A, e, t) {
  return function() {
    this.style.setProperty(A, e, t);
  };
}
function iS(A, e, t) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.style.removeProperty(A) : this.style.setProperty(A, n, t);
  };
}
function aS(A, e, t) {
  return arguments.length > 1 ? this.each((e == null ? nS : typeof e == "function" ? iS : rS)(A, e, t ?? "")) : Za(this.node(), A);
}
function Za(A, e) {
  return A.style.getPropertyValue(e) || Dv(A).getComputedStyle(A, null).getPropertyValue(e);
}
function oS(A) {
  return function() {
    delete this[A];
  };
}
function sS(A, e) {
  return function() {
    this[A] = e;
  };
}
function uS(A, e) {
  return function() {
    var t = e.apply(this, arguments);
    t == null ? delete this[A] : this[A] = t;
  };
}
function lS(A, e) {
  return arguments.length > 1 ? this.each((e == null ? oS : typeof e == "function" ? uS : sS)(A, e)) : this.node()[A];
}
function Ov(A) {
  return A.trim().split(/^|\s+/);
}
function yp(A) {
  return A.classList || new Nv(A);
}
function Nv(A) {
  this._node = A, this._names = Ov(A.getAttribute("class") || "");
}
Nv.prototype = {
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
function Mv(A, e) {
  for (var t = yp(A), n = -1, i = e.length; ++n < i; ) t.add(e[n]);
}
function Pv(A, e) {
  for (var t = yp(A), n = -1, i = e.length; ++n < i; ) t.remove(e[n]);
}
function cS(A) {
  return function() {
    Mv(this, A);
  };
}
function fS(A) {
  return function() {
    Pv(this, A);
  };
}
function hS(A, e) {
  return function() {
    (e.apply(this, arguments) ? Mv : Pv)(this, A);
  };
}
function dS(A, e) {
  var t = Ov(A + "");
  if (arguments.length < 2) {
    for (var n = yp(this.node()), i = -1, s = t.length; ++i < s; ) if (!n.contains(t[i])) return !1;
    return !0;
  }
  return this.each((typeof e == "function" ? hS : e ? cS : fS)(t, e));
}
function pS() {
  this.textContent = "";
}
function gS(A) {
  return function() {
    this.textContent = A;
  };
}
function BS(A) {
  return function() {
    var e = A.apply(this, arguments);
    this.textContent = e ?? "";
  };
}
function wS(A) {
  return arguments.length ? this.each(A == null ? pS : (typeof A == "function" ? BS : gS)(A)) : this.node().textContent;
}
function mS() {
  this.innerHTML = "";
}
function vS(A) {
  return function() {
    this.innerHTML = A;
  };
}
function yS(A) {
  return function() {
    var e = A.apply(this, arguments);
    this.innerHTML = e ?? "";
  };
}
function CS(A) {
  return arguments.length ? this.each(A == null ? mS : (typeof A == "function" ? yS : vS)(A)) : this.node().innerHTML;
}
function QS() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function FS() {
  return this.each(QS);
}
function US() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function bS() {
  return this.each(US);
}
function ES(A) {
  var e = typeof A == "function" ? A : xv(A);
  return this.select(function() {
    return this.appendChild(e.apply(this, arguments));
  });
}
function _S() {
  return null;
}
function xS(A, e) {
  var t = typeof A == "function" ? A : xv(A), n = e == null ? _S : typeof e == "function" ? e : vp(e);
  return this.select(function() {
    return this.insertBefore(t.apply(this, arguments), n.apply(this, arguments) || null);
  });
}
function IS() {
  var A = this.parentNode;
  A && A.removeChild(this);
}
function HS() {
  return this.each(IS);
}
function SS() {
  var A = this.cloneNode(!1), e = this.parentNode;
  return e ? e.insertBefore(A, this.nextSibling) : A;
}
function LS() {
  var A = this.cloneNode(!0), e = this.parentNode;
  return e ? e.insertBefore(A, this.nextSibling) : A;
}
function TS(A) {
  return this.select(A ? LS : SS);
}
function DS(A) {
  return arguments.length ? this.property("__data__", A) : this.node().__data__;
}
function OS(A) {
  return function(e) {
    A.call(this, e, this.__data__);
  };
}
function NS(A) {
  return A.trim().split(/^|\s+/).map(function(e) {
    var t = "", n = e.indexOf(".");
    return n >= 0 && (t = e.slice(n + 1), e = e.slice(0, n)), { type: e, name: t };
  });
}
function MS(A) {
  return function() {
    var e = this.__on;
    if (e) {
      for (var t = 0, n = -1, i = e.length, s; t < i; ++t)
        s = e[t], (!A.type || s.type === A.type) && s.name === A.name ? this.removeEventListener(s.type, s.listener, s.options) : e[++n] = s;
      ++n ? e.length = n : delete this.__on;
    }
  };
}
function PS(A, e, t) {
  return function() {
    var n = this.__on, i, s = OS(e);
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
function KS(A, e, t) {
  var n = NS(A + ""), i, s = n.length, l;
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
  for (f = e ? PS : MS, i = 0; i < s; ++i) this.each(f(n[i], e, t));
  return this;
}
function Kv(A, e, t) {
  var n = Dv(A), i = n.CustomEvent;
  typeof i == "function" ? i = new i(e, t) : (i = n.document.createEvent("Event"), t ? (i.initEvent(e, t.bubbles, t.cancelable), i.detail = t.detail) : i.initEvent(e, !1, !1)), A.dispatchEvent(i);
}
function RS(A, e) {
  return function() {
    return Kv(this, A, e);
  };
}
function kS(A, e) {
  return function() {
    return Kv(this, A, e.apply(this, arguments));
  };
}
function $S(A, e) {
  return this.each((typeof e == "function" ? kS : RS)(A, e));
}
function* GS() {
  for (var A = this._groups, e = 0, t = A.length; e < t; ++e)
    for (var n = A[e], i = 0, s = n.length, l; i < s; ++i)
      (l = n[i]) && (yield l);
}
var Cp = [null];
function $t(A, e) {
  this._groups = A, this._parents = e;
}
function Os() {
  return new $t([[document.documentElement]], Cp);
}
function VS() {
  return this;
}
$t.prototype = Os.prototype = {
  constructor: $t,
  select: wH,
  selectAll: yH,
  selectChild: UH,
  selectChildren: xH,
  filter: IH,
  data: OH,
  enter: HH,
  exit: MH,
  join: PH,
  merge: KH,
  selection: VS,
  order: RH,
  sort: kH,
  call: GH,
  nodes: VH,
  node: WH,
  size: XH,
  empty: qH,
  each: zH,
  attr: tS,
  style: aS,
  property: lS,
  classed: dS,
  text: wS,
  html: CS,
  raise: FS,
  lower: bS,
  append: ES,
  insert: xS,
  remove: HS,
  clone: TS,
  datum: DS,
  on: KS,
  dispatch: $S,
  [Symbol.iterator]: GS
};
function WA(A) {
  return typeof A == "string" ? new $t([[document.querySelector(A)]], [document.documentElement]) : new $t([[A]], Cp);
}
function WS(A) {
  let e;
  for (; e = A.sourceEvent; ) A = e;
  return A;
}
function kn(A, e) {
  if (A = WS(A), e === void 0 && (e = A.currentTarget), e) {
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
  return typeof A == "string" ? new $t([document.querySelectorAll(A)], [document.documentElement]) : new $t([Iv(A)], Cp);
}
const XS = { passive: !1 }, Cs = { capture: !0, passive: !1 };
function ih(A) {
  A.stopImmediatePropagation();
}
function qa(A) {
  A.preventDefault(), A.stopImmediatePropagation();
}
function Rv(A) {
  var e = A.document.documentElement, t = WA(A).on("dragstart.drag", qa, Cs);
  "onselectstart" in e ? t.on("selectstart.drag", qa, Cs) : (e.__noselect = e.style.MozUserSelect, e.style.MozUserSelect = "none");
}
function kv(A, e) {
  var t = A.document.documentElement, n = WA(A).on("dragstart.drag", null);
  e && (n.on("click.drag", qa, Cs), setTimeout(function() {
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
function qS(A) {
  return !A.ctrlKey && !A.button;
}
function zS() {
  return this.parentNode;
}
function JS(A, e) {
  return e ?? { x: A.x, y: A.y };
}
function jS() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function YS() {
  var A = qS, e = zS, t = JS, n = jS, i = {}, s = Ec("start", "drag", "end"), l = 0, f, c, h, w, B = 0;
  function p(E) {
    E.on("mousedown.drag", v).filter(n).on("touchstart.drag", F).on("touchmove.drag", U, XS).on("touchend.drag touchcancel.drag", H).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function v(E, M) {
    if (!(w || !A.call(this, E, M))) {
      var K = D(this, e.call(this, E, M), E, M, "mouse");
      K && (WA(E.view).on("mousemove.drag", o, Cs).on("mouseup.drag", C, Cs), Rv(E.view), ih(E), h = !1, f = E.clientX, c = E.clientY, K("start", E));
    }
  }
  function o(E) {
    if (qa(E), !h) {
      var M = E.clientX - f, K = E.clientY - c;
      h = M * M + K * K > B;
    }
    i.mouse("drag", E);
  }
  function C(E) {
    WA(E.view).on("mousemove.drag mouseup.drag", null), kv(E.view, h), qa(E), i.mouse("end", E);
  }
  function F(E, M) {
    if (A.call(this, E, M)) {
      var K = E.changedTouches, J = e.call(this, E, M), hA = K.length, cA, wA;
      for (cA = 0; cA < hA; ++cA)
        (wA = D(this, J, E, M, K[cA].identifier, K[cA])) && (ih(E), wA("start", E, K[cA]));
    }
  }
  function U(E) {
    var M = E.changedTouches, K = M.length, J, hA;
    for (J = 0; J < K; ++J)
      (hA = i[M[J].identifier]) && (qa(E), hA("drag", E, M[J]));
  }
  function H(E) {
    var M = E.changedTouches, K = M.length, J, hA;
    for (w && clearTimeout(w), w = setTimeout(function() {
      w = null;
    }, 500), J = 0; J < K; ++J)
      (hA = i[M[J].identifier]) && (ih(E), hA("end", E, M[J]));
  }
  function D(E, M, K, J, hA, cA) {
    var wA = s.copy(), QA = kn(cA || K, M), OA, EA, q;
    if ((q = t.call(E, new Xh("beforestart", {
      sourceEvent: K,
      target: p,
      identifier: hA,
      active: l,
      x: QA[0],
      y: QA[1],
      dx: 0,
      dy: 0,
      dispatch: wA
    }), J)) != null)
      return OA = q.x - QA[0] || 0, EA = q.y - QA[1] || 0, function CA(iA, gA, IA) {
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
          E,
          new Xh(iA, {
            sourceEvent: gA,
            subject: q,
            target: p,
            identifier: hA,
            active: uA,
            x: QA[0] + OA,
            y: QA[1] + EA,
            dx: QA[0] - HA[0],
            dy: QA[1] - HA[1],
            dispatch: wA
          }),
          J
        );
      };
  }
  return p.filter = function(E) {
    return arguments.length ? (A = typeof E == "function" ? E : Al(!!E), p) : A;
  }, p.container = function(E) {
    return arguments.length ? (e = typeof E == "function" ? E : Al(E), p) : e;
  }, p.subject = function(E) {
    return arguments.length ? (t = typeof E == "function" ? E : Al(E), p) : t;
  }, p.touchable = function(E) {
    return arguments.length ? (n = typeof E == "function" ? E : Al(!!E), p) : n;
  }, p.on = function() {
    var E = s.on.apply(s, arguments);
    return E === s ? p : E;
  }, p.clickDistance = function(E) {
    return arguments.length ? (B = (E = +E) * E, p) : Math.sqrt(B);
  }, p;
}
function Qp(A, e, t) {
  A.prototype = e.prototype = t, t.constructor = A;
}
function $v(A, e) {
  var t = Object.create(A.prototype);
  for (var n in e) t[n] = e[n];
  return t;
}
function Ns() {
}
var Qs = 0.7, Ac = 1 / Qs, za = "\\s*([+-]?\\d+)\\s*", Fs = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", or = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", ZS = /^#([0-9a-f]{3,8})$/, AL = new RegExp(`^rgb\\(${za},${za},${za}\\)$`), eL = new RegExp(`^rgb\\(${or},${or},${or}\\)$`), tL = new RegExp(`^rgba\\(${za},${za},${za},${Fs}\\)$`), nL = new RegExp(`^rgba\\(${or},${or},${or},${Fs}\\)$`), rL = new RegExp(`^hsl\\(${Fs},${or},${or}\\)$`), iL = new RegExp(`^hsla\\(${Fs},${or},${or},${Fs}\\)$`), iw = {
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
Qp(Ns, ra, {
  copy(A) {
    return Object.assign(new this.constructor(), this, A);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: aw,
  // Deprecated! Use color.formatHex.
  formatHex: aw,
  formatHex8: aL,
  formatHsl: oL,
  formatRgb: ow,
  toString: ow
});
function aw() {
  return this.rgb().formatHex();
}
function aL() {
  return this.rgb().formatHex8();
}
function oL() {
  return Gv(this).formatHsl();
}
function ow() {
  return this.rgb().formatRgb();
}
function ra(A) {
  var e, t;
  return A = (A + "").trim().toLowerCase(), (e = ZS.exec(A)) ? (t = e[1].length, e = parseInt(e[1], 16), t === 6 ? sw(e) : t === 3 ? new Yt(e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, (e & 15) << 4 | e & 15, 1) : t === 8 ? el(e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, (e & 255) / 255) : t === 4 ? el(e >> 12 & 15 | e >> 8 & 240, e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, ((e & 15) << 4 | e & 15) / 255) : null) : (e = AL.exec(A)) ? new Yt(e[1], e[2], e[3], 1) : (e = eL.exec(A)) ? new Yt(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, 1) : (e = tL.exec(A)) ? el(e[1], e[2], e[3], e[4]) : (e = nL.exec(A)) ? el(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, e[4]) : (e = rL.exec(A)) ? cw(e[1], e[2] / 100, e[3] / 100, 1) : (e = iL.exec(A)) ? cw(e[1], e[2] / 100, e[3] / 100, e[4]) : iw.hasOwnProperty(A) ? sw(iw[A]) : A === "transparent" ? new Yt(NaN, NaN, NaN, 0) : null;
}
function sw(A) {
  return new Yt(A >> 16 & 255, A >> 8 & 255, A & 255, 1);
}
function el(A, e, t, n) {
  return n <= 0 && (A = e = t = NaN), new Yt(A, e, t, n);
}
function sL(A) {
  return A instanceof Ns || (A = ra(A)), A ? (A = A.rgb(), new Yt(A.r, A.g, A.b, A.opacity)) : new Yt();
}
function qh(A, e, t, n) {
  return arguments.length === 1 ? sL(A) : new Yt(A, e, t, n ?? 1);
}
function Yt(A, e, t, n) {
  this.r = +A, this.g = +e, this.b = +t, this.opacity = +n;
}
Qp(Yt, qh, $v(Ns, {
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
  hex: uw,
  // Deprecated! Use color.formatHex.
  formatHex: uw,
  formatHex8: uL,
  formatRgb: lw,
  toString: lw
}));
function uw() {
  return `#${Ji(this.r)}${Ji(this.g)}${Ji(this.b)}`;
}
function uL() {
  return `#${Ji(this.r)}${Ji(this.g)}${Ji(this.b)}${Ji((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function lw() {
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
function cw(A, e, t, n) {
  return n <= 0 ? A = e = t = NaN : t <= 0 || t >= 1 ? A = e = NaN : e <= 0 && (A = NaN), new Vn(A, e, t, n);
}
function Gv(A) {
  if (A instanceof Vn) return new Vn(A.h, A.s, A.l, A.opacity);
  if (A instanceof Ns || (A = ra(A)), !A) return new Vn();
  if (A instanceof Vn) return A;
  A = A.rgb();
  var e = A.r / 255, t = A.g / 255, n = A.b / 255, i = Math.min(e, t, n), s = Math.max(e, t, n), l = NaN, f = s - i, c = (s + i) / 2;
  return f ? (e === s ? l = (t - n) / f + (t < n) * 6 : t === s ? l = (n - e) / f + 2 : l = (e - t) / f + 4, f /= c < 0.5 ? s + i : 2 - s - i, l *= 60) : f = c > 0 && c < 1 ? 0 : l, new Vn(l, f, c, A.opacity);
}
function lL(A, e, t, n) {
  return arguments.length === 1 ? Gv(A) : new Vn(A, e, t, n ?? 1);
}
function Vn(A, e, t, n) {
  this.h = +A, this.s = +e, this.l = +t, this.opacity = +n;
}
Qp(Vn, lL, $v(Ns, {
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
    return new Vn(fw(this.h), tl(this.s), tl(this.l), ec(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const A = ec(this.opacity);
    return `${A === 1 ? "hsl(" : "hsla("}${fw(this.h)}, ${tl(this.s) * 100}%, ${tl(this.l) * 100}%${A === 1 ? ")" : `, ${A})`}`;
  }
}));
function fw(A) {
  return A = (A || 0) % 360, A < 0 ? A + 360 : A;
}
function tl(A) {
  return Math.max(0, Math.min(1, A || 0));
}
function ah(A, e, t) {
  return (A < 60 ? e + (t - e) * A / 60 : A < 180 ? t : A < 240 ? e + (t - e) * (240 - A) / 60 : e) * 255;
}
const Fp = (A) => () => A;
function cL(A, e) {
  return function(t) {
    return A + t * e;
  };
}
function fL(A, e, t) {
  return A = Math.pow(A, t), e = Math.pow(e, t) - A, t = 1 / t, function(n) {
    return Math.pow(A + n * e, t);
  };
}
function hL(A) {
  return (A = +A) == 1 ? Vv : function(e, t) {
    return t - e ? fL(e, t, A) : Fp(isNaN(e) ? t : e);
  };
}
function Vv(A, e) {
  var t = e - A;
  return t ? cL(A, t) : Fp(isNaN(A) ? e : A);
}
const tc = function A(e) {
  var t = hL(e);
  function n(i, s) {
    var l = t((i = qh(i)).r, (s = qh(s)).r), f = t(i.g, s.g), c = t(i.b, s.b), h = Vv(i.opacity, s.opacity);
    return function(w) {
      return i.r = l(w), i.g = f(w), i.b = c(w), i.opacity = h(w), i + "";
    };
  }
  return n.gamma = A, n;
}(1);
function dL(A, e) {
  e || (e = []);
  var t = A ? Math.min(e.length, A.length) : 0, n = e.slice(), i;
  return function(s) {
    for (i = 0; i < t; ++i) n[i] = A[i] * (1 - s) + e[i] * s;
    return n;
  };
}
function pL(A) {
  return ArrayBuffer.isView(A) && !(A instanceof DataView);
}
function gL(A, e) {
  var t = e ? e.length : 0, n = A ? Math.min(t, A.length) : 0, i = new Array(n), s = new Array(t), l;
  for (l = 0; l < n; ++l) i[l] = Up(A[l], e[l]);
  for (; l < t; ++l) s[l] = e[l];
  return function(f) {
    for (l = 0; l < n; ++l) s[l] = i[l](f);
    return s;
  };
}
function BL(A, e) {
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
function wL(A, e) {
  var t = {}, n = {}, i;
  (A === null || typeof A != "object") && (A = {}), (e === null || typeof e != "object") && (e = {});
  for (i in e)
    i in A ? t[i] = Up(A[i], e[i]) : n[i] = e[i];
  return function(s) {
    for (i in t) n[i] = t[i](s);
    return n;
  };
}
var zh = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, oh = new RegExp(zh.source, "g");
function mL(A) {
  return function() {
    return A;
  };
}
function vL(A) {
  return function(e) {
    return A(e) + "";
  };
}
function Wv(A, e) {
  var t = zh.lastIndex = oh.lastIndex = 0, n, i, s, l = -1, f = [], c = [];
  for (A = A + "", e = e + ""; (n = zh.exec(A)) && (i = oh.exec(e)); )
    (s = i.index) > t && (s = e.slice(t, s), f[l] ? f[l] += s : f[++l] = s), (n = n[0]) === (i = i[0]) ? f[l] ? f[l] += i : f[++l] = i : (f[++l] = null, c.push({ i: l, x: $n(n, i) })), t = oh.lastIndex;
  return t < e.length && (s = e.slice(t), f[l] ? f[l] += s : f[++l] = s), f.length < 2 ? c[0] ? vL(c[0].x) : mL(e) : (e = c.length, function(h) {
    for (var w = 0, B; w < e; ++w) f[(B = c[w]).i] = B.x(h);
    return f.join("");
  });
}
function Up(A, e) {
  var t = typeof e, n;
  return e == null || t === "boolean" ? Fp(e) : (t === "number" ? $n : t === "string" ? (n = ra(e)) ? (e = n, tc) : Wv : e instanceof ra ? tc : e instanceof Date ? BL : pL(e) ? dL : Array.isArray(e) ? gL : typeof e.valueOf != "function" && typeof e.toString != "function" || isNaN(e) ? wL : $n)(A, e);
}
function yL(A, e) {
  return A = +A, e = +e, function(t) {
    return Math.round(A * (1 - t) + e * t);
  };
}
var hw = 180 / Math.PI, Jh = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function Xv(A, e, t, n, i, s) {
  var l, f, c;
  return (l = Math.sqrt(A * A + e * e)) && (A /= l, e /= l), (c = A * t + e * n) && (t -= A * c, n -= e * c), (f = Math.sqrt(t * t + n * n)) && (t /= f, n /= f, c /= f), A * n < e * t && (A = -A, e = -e, c = -c, l = -l), {
    translateX: i,
    translateY: s,
    rotate: Math.atan2(e, A) * hw,
    skewX: Math.atan(c) * hw,
    scaleX: l,
    scaleY: f
  };
}
var nl;
function CL(A) {
  const e = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(A + "");
  return e.isIdentity ? Jh : Xv(e.a, e.b, e.c, e.d, e.e, e.f);
}
function QL(A) {
  return A == null || (nl || (nl = document.createElementNS("http://www.w3.org/2000/svg", "g")), nl.setAttribute("transform", A), !(A = nl.transform.baseVal.consolidate())) ? Jh : (A = A.matrix, Xv(A.a, A.b, A.c, A.d, A.e, A.f));
}
function qv(A, e, t, n) {
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
var FL = qv(CL, "px, ", "px)", "deg)"), UL = qv(QL, ", ", ")", ")"), bL = 1e-12;
function dw(A) {
  return ((A = Math.exp(A)) + 1 / A) / 2;
}
function EL(A) {
  return ((A = Math.exp(A)) - 1 / A) / 2;
}
function _L(A) {
  return ((A = Math.exp(2 * A)) - 1) / (A + 1);
}
const xL = function A(e, t, n) {
  function i(s, l) {
    var f = s[0], c = s[1], h = s[2], w = l[0], B = l[1], p = l[2], v = w - f, o = B - c, C = v * v + o * o, F, U;
    if (C < bL)
      U = Math.log(p / h) / e, F = function(J) {
        return [
          f + J * v,
          c + J * o,
          h * Math.exp(e * J * U)
        ];
      };
    else {
      var H = Math.sqrt(C), D = (p * p - h * h + n * C) / (2 * h * t * H), E = (p * p - h * h - n * C) / (2 * p * t * H), M = Math.log(Math.sqrt(D * D + 1) - D), K = Math.log(Math.sqrt(E * E + 1) - E);
      U = (K - M) / e, F = function(J) {
        var hA = J * U, cA = dw(M), wA = h / (t * H) * (cA * _L(e * hA + M) - EL(M));
        return [
          f + wA * v,
          c + wA * o,
          h * cA / dw(e * hA + M)
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
var Ao = 0, As = 0, Vo = 0, zv = 1e3, nc, es, rc = 0, ia = 0, xc = 0, Us = typeof performance == "object" && performance.now ? performance : Date, Jv = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(A) {
  setTimeout(A, 17);
};
function bp() {
  return ia || (Jv(IL), ia = Us.now() + xc);
}
function IL() {
  ia = 0;
}
function ic() {
  this._call = this._time = this._next = null;
}
ic.prototype = jv.prototype = {
  constructor: ic,
  restart: function(A, e, t) {
    if (typeof A != "function") throw new TypeError("callback is not a function");
    t = (t == null ? bp() : +t) + (e == null ? 0 : +e), !this._next && es !== this && (es ? es._next = this : nc = this, es = this), this._call = A, this._time = t, jh();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, jh());
  }
};
function jv(A, e, t) {
  var n = new ic();
  return n.restart(A, e, t), n;
}
function HL() {
  bp(), ++Ao;
  for (var A = nc, e; A; )
    (e = ia - A._time) >= 0 && A._call.call(void 0, e), A = A._next;
  --Ao;
}
function pw() {
  ia = (rc = Us.now()) + xc, Ao = As = 0;
  try {
    HL();
  } finally {
    Ao = 0, LL(), ia = 0;
  }
}
function SL() {
  var A = Us.now(), e = A - rc;
  e > zv && (xc -= e, rc = A);
}
function LL() {
  for (var A, e = nc, t, n = 1 / 0; e; )
    e._call ? (n > e._time && (n = e._time), A = e, e = e._next) : (t = e._next, e._next = null, e = A ? A._next = t : nc = t);
  es = A, jh(n);
}
function jh(A) {
  if (!Ao) {
    As && (As = clearTimeout(As));
    var e = A - ia;
    e > 24 ? (A < 1 / 0 && (As = setTimeout(pw, A - Us.now() - xc)), Vo && (Vo = clearInterval(Vo))) : (Vo || (rc = Us.now(), Vo = setInterval(SL, zv)), Ao = 1, Jv(pw));
  }
}
function gw(A, e, t) {
  var n = new ic();
  return e = e == null ? 0 : +e, n.restart((i) => {
    n.stop(), A(i + e);
  }, e, t), n;
}
var TL = Ec("start", "end", "cancel", "interrupt"), DL = [], Yv = 0, Bw = 1, Yh = 2, Pl = 3, ww = 4, Zh = 5, Kl = 6;
function Ic(A, e, t, n, i, s) {
  var l = A.__transition;
  if (!l) A.__transition = {};
  else if (t in l) return;
  OL(A, t, {
    name: e,
    index: n,
    // For context during callback.
    group: i,
    // For context during callback.
    on: TL,
    tween: DL,
    time: s.time,
    delay: s.delay,
    duration: s.duration,
    ease: s.ease,
    timer: null,
    state: Yv
  });
}
function Ep(A, e) {
  var t = Wn(A, e);
  if (t.state > Yv) throw new Error("too late; already scheduled");
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
function OL(A, e, t) {
  var n = A.__transition, i;
  n[e] = t, t.timer = jv(s, 0, t.time);
  function s(h) {
    t.state = Bw, t.timer.restart(l, t.delay, t.time), t.delay <= h && l(h - t.delay);
  }
  function l(h) {
    var w, B, p, v;
    if (t.state !== Bw) return c();
    for (w in n)
      if (v = n[w], v.name === t.name) {
        if (v.state === Pl) return gw(l);
        v.state === ww ? (v.state = Kl, v.timer.stop(), v.on.call("interrupt", A, A.__data__, v.index, v.group), delete n[w]) : +w < e && (v.state = Kl, v.timer.stop(), v.on.call("cancel", A, A.__data__, v.index, v.group), delete n[w]);
      }
    if (gw(function() {
      t.state === Pl && (t.state = ww, t.timer.restart(f, t.delay, t.time), f(h));
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
      i = n.state > Yh && n.state < Zh, n.state = Kl, n.timer.stop(), n.on.call(i ? "interrupt" : "cancel", A, A.__data__, n.index, n.group), delete t[l];
    }
    s && delete A.__transition;
  }
}
function NL(A) {
  return this.each(function() {
    Rl(this, A);
  });
}
function ML(A, e) {
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
function PL(A, e, t) {
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
function KL(A, e) {
  var t = this._id;
  if (A += "", arguments.length < 2) {
    for (var n = Wn(this.node(), t).tween, i = 0, s = n.length, l; i < s; ++i)
      if ((l = n[i]).name === A)
        return l.value;
    return null;
  }
  return this.each((e == null ? ML : PL)(t, A, e));
}
function _p(A, e, t) {
  var n = A._id;
  return A.each(function() {
    var i = cr(this, n);
    (i.value || (i.value = {}))[e] = t.apply(this, arguments);
  }), function(i) {
    return Wn(i, n).value[e];
  };
}
function Zv(A, e) {
  var t;
  return (typeof e == "number" ? $n : e instanceof ra ? tc : (t = ra(e)) ? (e = t, tc) : Wv)(A, e);
}
function RL(A) {
  return function() {
    this.removeAttribute(A);
  };
}
function kL(A) {
  return function() {
    this.removeAttributeNS(A.space, A.local);
  };
}
function $L(A, e, t) {
  var n, i = t + "", s;
  return function() {
    var l = this.getAttribute(A);
    return l === i ? null : l === n ? s : s = e(n = l, t);
  };
}
function GL(A, e, t) {
  var n, i = t + "", s;
  return function() {
    var l = this.getAttributeNS(A.space, A.local);
    return l === i ? null : l === n ? s : s = e(n = l, t);
  };
}
function VL(A, e, t) {
  var n, i, s;
  return function() {
    var l, f = t(this), c;
    return f == null ? void this.removeAttribute(A) : (l = this.getAttribute(A), c = f + "", l === c ? null : l === n && c === i ? s : (i = c, s = e(n = l, f)));
  };
}
function WL(A, e, t) {
  var n, i, s;
  return function() {
    var l, f = t(this), c;
    return f == null ? void this.removeAttributeNS(A.space, A.local) : (l = this.getAttributeNS(A.space, A.local), c = f + "", l === c ? null : l === n && c === i ? s : (i = c, s = e(n = l, f)));
  };
}
function XL(A, e) {
  var t = _c(A), n = t === "transform" ? UL : Zv;
  return this.attrTween(A, typeof e == "function" ? (t.local ? WL : VL)(t, n, _p(this, "attr." + A, e)) : e == null ? (t.local ? kL : RL)(t) : (t.local ? GL : $L)(t, n, e));
}
function qL(A, e) {
  return function(t) {
    this.setAttribute(A, e.call(this, t));
  };
}
function zL(A, e) {
  return function(t) {
    this.setAttributeNS(A.space, A.local, e.call(this, t));
  };
}
function JL(A, e) {
  var t, n;
  function i() {
    var s = e.apply(this, arguments);
    return s !== n && (t = (n = s) && zL(A, s)), t;
  }
  return i._value = e, i;
}
function jL(A, e) {
  var t, n;
  function i() {
    var s = e.apply(this, arguments);
    return s !== n && (t = (n = s) && qL(A, s)), t;
  }
  return i._value = e, i;
}
function YL(A, e) {
  var t = "attr." + A;
  if (arguments.length < 2) return (t = this.tween(t)) && t._value;
  if (e == null) return this.tween(t, null);
  if (typeof e != "function") throw new Error();
  var n = _c(A);
  return this.tween(t, (n.local ? JL : jL)(n, e));
}
function ZL(A, e) {
  return function() {
    Ep(this, A).delay = +e.apply(this, arguments);
  };
}
function AT(A, e) {
  return e = +e, function() {
    Ep(this, A).delay = e;
  };
}
function eT(A) {
  var e = this._id;
  return arguments.length ? this.each((typeof A == "function" ? ZL : AT)(e, A)) : Wn(this.node(), e).delay;
}
function tT(A, e) {
  return function() {
    cr(this, A).duration = +e.apply(this, arguments);
  };
}
function nT(A, e) {
  return e = +e, function() {
    cr(this, A).duration = e;
  };
}
function rT(A) {
  var e = this._id;
  return arguments.length ? this.each((typeof A == "function" ? tT : nT)(e, A)) : Wn(this.node(), e).duration;
}
function iT(A, e) {
  if (typeof e != "function") throw new Error();
  return function() {
    cr(this, A).ease = e;
  };
}
function aT(A) {
  var e = this._id;
  return arguments.length ? this.each(iT(e, A)) : Wn(this.node(), e).ease;
}
function oT(A, e) {
  return function() {
    var t = e.apply(this, arguments);
    if (typeof t != "function") throw new Error();
    cr(this, A).ease = t;
  };
}
function sT(A) {
  if (typeof A != "function") throw new Error();
  return this.each(oT(this._id, A));
}
function uT(A) {
  typeof A != "function" && (A = Sv(A));
  for (var e = this._groups, t = e.length, n = new Array(t), i = 0; i < t; ++i)
    for (var s = e[i], l = s.length, f = n[i] = [], c, h = 0; h < l; ++h)
      (c = s[h]) && A.call(c, c.__data__, h, s) && f.push(c);
  return new Rr(n, this._parents, this._name, this._id);
}
function lT(A) {
  if (A._id !== this._id) throw new Error();
  for (var e = this._groups, t = A._groups, n = e.length, i = t.length, s = Math.min(n, i), l = new Array(n), f = 0; f < s; ++f)
    for (var c = e[f], h = t[f], w = c.length, B = l[f] = new Array(w), p, v = 0; v < w; ++v)
      (p = c[v] || h[v]) && (B[v] = p);
  for (; f < n; ++f)
    l[f] = e[f];
  return new Rr(l, this._parents, this._name, this._id);
}
function cT(A) {
  return (A + "").trim().split(/^|\s+/).every(function(e) {
    var t = e.indexOf(".");
    return t >= 0 && (e = e.slice(0, t)), !e || e === "start";
  });
}
function fT(A, e, t) {
  var n, i, s = cT(e) ? Ep : cr;
  return function() {
    var l = s(this, A), f = l.on;
    f !== n && (i = (n = f).copy()).on(e, t), l.on = i;
  };
}
function hT(A, e) {
  var t = this._id;
  return arguments.length < 2 ? Wn(this.node(), t).on.on(A) : this.each(fT(t, A, e));
}
function dT(A) {
  return function() {
    var e = this.parentNode;
    for (var t in this.__transition) if (+t !== A) return;
    e && e.removeChild(this);
  };
}
function pT() {
  return this.on("end.remove", dT(this._id));
}
function gT(A) {
  var e = this._name, t = this._id;
  typeof A != "function" && (A = vp(A));
  for (var n = this._groups, i = n.length, s = new Array(i), l = 0; l < i; ++l)
    for (var f = n[l], c = f.length, h = s[l] = new Array(c), w, B, p = 0; p < c; ++p)
      (w = f[p]) && (B = A.call(w, w.__data__, p, f)) && ("__data__" in w && (B.__data__ = w.__data__), h[p] = B, Ic(h[p], e, t, p, h, Wn(w, t)));
  return new Rr(s, this._parents, e, t);
}
function BT(A) {
  var e = this._name, t = this._id;
  typeof A != "function" && (A = Hv(A));
  for (var n = this._groups, i = n.length, s = [], l = [], f = 0; f < i; ++f)
    for (var c = n[f], h = c.length, w, B = 0; B < h; ++B)
      if (w = c[B]) {
        for (var p = A.call(w, w.__data__, B, c), v, o = Wn(w, t), C = 0, F = p.length; C < F; ++C)
          (v = p[C]) && Ic(v, e, t, C, p, o);
        s.push(p), l.push(w);
      }
  return new Rr(s, l, e, t);
}
var wT = Os.prototype.constructor;
function mT() {
  return new wT(this._groups, this._parents);
}
function vT(A, e) {
  var t, n, i;
  return function() {
    var s = Za(this, A), l = (this.style.removeProperty(A), Za(this, A));
    return s === l ? null : s === t && l === n ? i : i = e(t = s, n = l);
  };
}
function A0(A) {
  return function() {
    this.style.removeProperty(A);
  };
}
function yT(A, e, t) {
  var n, i = t + "", s;
  return function() {
    var l = Za(this, A);
    return l === i ? null : l === n ? s : s = e(n = l, t);
  };
}
function CT(A, e, t) {
  var n, i, s;
  return function() {
    var l = Za(this, A), f = t(this), c = f + "";
    return f == null && (c = f = (this.style.removeProperty(A), Za(this, A))), l === c ? null : l === n && c === i ? s : (i = c, s = e(n = l, f));
  };
}
function QT(A, e) {
  var t, n, i, s = "style." + e, l = "end." + s, f;
  return function() {
    var c = cr(this, A), h = c.on, w = c.value[s] == null ? f || (f = A0(e)) : void 0;
    (h !== t || i !== w) && (n = (t = h).copy()).on(l, i = w), c.on = n;
  };
}
function FT(A, e, t) {
  var n = (A += "") == "transform" ? FL : Zv;
  return e == null ? this.styleTween(A, vT(A, n)).on("end.style." + A, A0(A)) : typeof e == "function" ? this.styleTween(A, CT(A, n, _p(this, "style." + A, e))).each(QT(this._id, A)) : this.styleTween(A, yT(A, n, e), t).on("end.style." + A, null);
}
function UT(A, e, t) {
  return function(n) {
    this.style.setProperty(A, e.call(this, n), t);
  };
}
function bT(A, e, t) {
  var n, i;
  function s() {
    var l = e.apply(this, arguments);
    return l !== i && (n = (i = l) && UT(A, l, t)), n;
  }
  return s._value = e, s;
}
function ET(A, e, t) {
  var n = "style." + (A += "");
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (e == null) return this.tween(n, null);
  if (typeof e != "function") throw new Error();
  return this.tween(n, bT(A, e, t ?? ""));
}
function _T(A) {
  return function() {
    this.textContent = A;
  };
}
function xT(A) {
  return function() {
    var e = A(this);
    this.textContent = e ?? "";
  };
}
function IT(A) {
  return this.tween("text", typeof A == "function" ? xT(_p(this, "text", A)) : _T(A == null ? "" : A + ""));
}
function HT(A) {
  return function(e) {
    this.textContent = A.call(this, e);
  };
}
function ST(A) {
  var e, t;
  function n() {
    var i = A.apply(this, arguments);
    return i !== t && (e = (t = i) && HT(i)), e;
  }
  return n._value = A, n;
}
function LT(A) {
  var e = "text";
  if (arguments.length < 1) return (e = this.tween(e)) && e._value;
  if (A == null) return this.tween(e, null);
  if (typeof A != "function") throw new Error();
  return this.tween(e, ST(A));
}
function TT() {
  for (var A = this._name, e = this._id, t = e0(), n = this._groups, i = n.length, s = 0; s < i; ++s)
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
  return new Rr(n, this._parents, A, t);
}
function DT() {
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
var OT = 0;
function Rr(A, e, t, n) {
  this._groups = A, this._parents = e, this._name = t, this._id = n;
}
function e0() {
  return ++OT;
}
var Tr = Os.prototype;
Rr.prototype = {
  constructor: Rr,
  select: gT,
  selectAll: BT,
  selectChild: Tr.selectChild,
  selectChildren: Tr.selectChildren,
  filter: uT,
  merge: lT,
  selection: mT,
  transition: TT,
  call: Tr.call,
  nodes: Tr.nodes,
  node: Tr.node,
  size: Tr.size,
  empty: Tr.empty,
  each: Tr.each,
  on: hT,
  attr: XL,
  attrTween: YL,
  style: FT,
  styleTween: ET,
  text: IT,
  textTween: LT,
  remove: pT,
  tween: KL,
  delay: eT,
  duration: rT,
  ease: aT,
  easeVarying: sT,
  end: DT,
  [Symbol.iterator]: Tr[Symbol.iterator]
};
function NT(A) {
  return ((A *= 2) <= 1 ? A * A * A : (A -= 2) * A * A + 2) / 2;
}
var MT = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: NT
};
function PT(A, e) {
  for (var t; !(t = A.__transition) || !(t = t[e]); )
    if (!(A = A.parentNode))
      throw new Error(`transition ${e} not found`);
  return t;
}
function KT(A) {
  var e, t;
  A instanceof Rr ? (e = A._id, A = A._name) : (e = e0(), (t = MT).time = bp(), A = A == null ? null : A + "");
  for (var n = this._groups, i = n.length, s = 0; s < i; ++s)
    for (var l = n[s], f = l.length, c, h = 0; h < f; ++h)
      (c = l[h]) && Ic(c, A, e, h, l, t || PT(c, e));
  return new Rr(n, this._parents, A, e);
}
Os.prototype.interrupt = NL;
Os.prototype.transition = KT;
function RT(A) {
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
function kT(A, e) {
  return function(t, n) {
    for (var i = t.length, s = [], l = 0, f = A[0], c = 0; i > 0 && f > 0 && (c + f + 1 > n && (f = Math.max(1, n - c)), s.push(t.substring(i -= f, i + f)), !((c += f + 1) > n)); )
      f = A[l = (l + 1) % A.length];
    return s.reverse().join(e);
  };
}
function $T(A) {
  return function(e) {
    return e.replace(/[0-9]/g, function(t) {
      return A[+t];
    });
  };
}
var GT = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function oc(A) {
  if (!(e = GT.exec(A))) throw new Error("invalid format: " + A);
  var e;
  return new xp({
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
oc.prototype = xp.prototype;
function xp(A) {
  this.fill = A.fill === void 0 ? " " : A.fill + "", this.align = A.align === void 0 ? ">" : A.align + "", this.sign = A.sign === void 0 ? "-" : A.sign + "", this.symbol = A.symbol === void 0 ? "" : A.symbol + "", this.zero = !!A.zero, this.width = A.width === void 0 ? void 0 : +A.width, this.comma = !!A.comma, this.precision = A.precision === void 0 ? void 0 : +A.precision, this.trim = !!A.trim, this.type = A.type === void 0 ? "" : A.type + "";
}
xp.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
function VT(A) {
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
var t0;
function WT(A, e) {
  var t = ac(A, e);
  if (!t) return A + "";
  var n = t[0], i = t[1], s = i - (t0 = Math.max(-8, Math.min(8, Math.floor(i / 3))) * 3) + 1, l = n.length;
  return s === l ? n : s > l ? n + new Array(s - l + 1).join("0") : s > 0 ? n.slice(0, s) + "." + n.slice(s) : "0." + new Array(1 - s).join("0") + ac(A, Math.max(0, e + s - 1))[0];
}
function mw(A, e) {
  var t = ac(A, e);
  if (!t) return A + "";
  var n = t[0], i = t[1];
  return i < 0 ? "0." + new Array(-i).join("0") + n : n.length > i + 1 ? n.slice(0, i + 1) + "." + n.slice(i + 1) : n + new Array(i - n.length + 2).join("0");
}
const vw = {
  "%": (A, e) => (A * 100).toFixed(e),
  b: (A) => Math.round(A).toString(2),
  c: (A) => A + "",
  d: RT,
  e: (A, e) => A.toExponential(e),
  f: (A, e) => A.toFixed(e),
  g: (A, e) => A.toPrecision(e),
  o: (A) => Math.round(A).toString(8),
  p: (A, e) => mw(A * 100, e),
  r: mw,
  s: WT,
  X: (A) => Math.round(A).toString(16).toUpperCase(),
  x: (A) => Math.round(A).toString(16)
};
function yw(A) {
  return A;
}
var Cw = Array.prototype.map, Qw = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function XT(A) {
  var e = A.grouping === void 0 || A.thousands === void 0 ? yw : kT(Cw.call(A.grouping, Number), A.thousands + ""), t = A.currency === void 0 ? "" : A.currency[0] + "", n = A.currency === void 0 ? "" : A.currency[1] + "", i = A.decimal === void 0 ? "." : A.decimal + "", s = A.numerals === void 0 ? yw : $T(Cw.call(A.numerals, String)), l = A.percent === void 0 ? "%" : A.percent + "", f = A.minus === void 0 ? "−" : A.minus + "", c = A.nan === void 0 ? "NaN" : A.nan + "";
  function h(B) {
    B = oc(B);
    var p = B.fill, v = B.align, o = B.sign, C = B.symbol, F = B.zero, U = B.width, H = B.comma, D = B.precision, E = B.trim, M = B.type;
    M === "n" ? (H = !0, M = "g") : vw[M] || (D === void 0 && (D = 12), E = !0, M = "g"), (F || p === "0" && v === "=") && (F = !0, p = "0", v = "=");
    var K = C === "$" ? t : C === "#" && /[boxX]/.test(M) ? "0" + M.toLowerCase() : "", J = C === "$" ? n : /[%p]/.test(M) ? l : "", hA = vw[M], cA = /[defgprs%]/.test(M);
    D = D === void 0 ? 6 : /[gprs]/.test(M) ? Math.max(1, Math.min(21, D)) : Math.max(0, Math.min(20, D));
    function wA(QA) {
      var OA = K, EA = J, q, CA, iA;
      if (M === "c")
        EA = hA(QA) + EA, QA = "";
      else {
        QA = +QA;
        var gA = QA < 0 || 1 / QA < 0;
        if (QA = isNaN(QA) ? c : hA(Math.abs(QA), D), E && (QA = VT(QA)), gA && +QA == 0 && o !== "+" && (gA = !1), OA = (gA ? o === "(" ? o : f : o === "-" || o === "(" ? "" : o) + OA, EA = (M === "s" ? Qw[8 + t0 / 3] : "") + EA + (gA && o === "(" ? ")" : ""), cA) {
          for (q = -1, CA = QA.length; ++q < CA; )
            if (iA = QA.charCodeAt(q), 48 > iA || iA > 57) {
              EA = (iA === 46 ? i + QA.slice(q + 1) : QA.slice(q)) + EA, QA = QA.slice(0, q);
              break;
            }
        }
      }
      H && !F && (QA = e(QA, 1 / 0));
      var IA = OA.length + QA.length + EA.length, HA = IA < U ? new Array(U - IA + 1).join(p) : "";
      switch (H && F && (QA = e(HA + QA, HA.length ? U - EA.length : 1 / 0), HA = ""), v) {
        case "<":
          QA = OA + QA + EA + HA;
          break;
        case "=":
          QA = OA + HA + QA + EA;
          break;
        case "^":
          QA = HA.slice(0, IA = HA.length >> 1) + OA + QA + EA + HA.slice(IA);
          break;
        default:
          QA = HA + OA + QA + EA;
          break;
      }
      return s(QA);
    }
    return wA.toString = function() {
      return B + "";
    }, wA;
  }
  function w(B, p) {
    var v = h((B = oc(B), B.type = "f", B)), o = Math.max(-8, Math.min(8, Math.floor(eo(p) / 3))) * 3, C = Math.pow(10, -o), F = Qw[8 + o / 3];
    return function(U) {
      return v(C * U) + F;
    };
  }
  return {
    format: h,
    formatPrefix: w
  };
}
var rl, n0, r0;
qT({
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});
function qT(A) {
  return rl = XT(A), n0 = rl.format, r0 = rl.formatPrefix, rl;
}
function zT(A) {
  return Math.max(0, -eo(Math.abs(A)));
}
function JT(A, e) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(eo(e) / 3))) * 3 - eo(Math.abs(A)));
}
function jT(A, e) {
  return A = Math.abs(A), e = Math.abs(e) - A, Math.max(0, eo(e) - eo(A)) + 1;
}
function YT(A, e) {
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
function ZT(A) {
  return function() {
    return A;
  };
}
function AD(A) {
  return +A;
}
var Fw = [0, 1];
function Ga(A) {
  return A;
}
function Ad(A, e) {
  return (e -= A = +A) ? function(t) {
    return (t - A) / e;
  } : ZT(isNaN(e) ? NaN : 0.5);
}
function eD(A, e) {
  var t;
  return A > e && (t = A, A = e, e = t), function(n) {
    return Math.max(A, Math.min(e, n));
  };
}
function tD(A, e, t) {
  var n = A[0], i = A[1], s = e[0], l = e[1];
  return i < n ? (n = Ad(i, n), s = t(l, s)) : (n = Ad(n, i), s = t(s, l)), function(f) {
    return s(n(f));
  };
}
function nD(A, e, t) {
  var n = Math.min(A.length, e.length) - 1, i = new Array(n), s = new Array(n), l = -1;
  for (A[n] < A[0] && (A = A.slice().reverse(), e = e.slice().reverse()); ++l < n; )
    i[l] = Ad(A[l], A[l + 1]), s[l] = t(e[l], e[l + 1]);
  return function(f) {
    var c = aH(A, f, 1, n) - 1;
    return s[c](i[c](f));
  };
}
function rD(A, e) {
  return e.domain(A.domain()).range(A.range()).interpolate(A.interpolate()).clamp(A.clamp()).unknown(A.unknown());
}
function iD() {
  var A = Fw, e = Fw, t = Up, n, i, s, l = Ga, f, c, h;
  function w() {
    var p = Math.min(A.length, e.length);
    return l !== Ga && (l = eD(A[0], A[p - 1])), f = p > 2 ? nD : tD, c = h = null, B;
  }
  function B(p) {
    return p == null || isNaN(p = +p) ? s : (c || (c = f(A.map(n), e, t)))(n(l(p)));
  }
  return B.invert = function(p) {
    return l(i((h || (h = f(e, A.map(n), $n)))(p)));
  }, B.domain = function(p) {
    return arguments.length ? (A = Array.from(p, AD), w()) : A.slice();
  }, B.range = function(p) {
    return arguments.length ? (e = Array.from(p), w()) : e.slice();
  }, B.rangeRound = function(p) {
    return e = Array.from(p), t = yL, w();
  }, B.clamp = function(p) {
    return arguments.length ? (l = p ? !0 : Ga, w()) : l !== Ga;
  }, B.interpolate = function(p) {
    return arguments.length ? (t = p, w()) : t;
  }, B.unknown = function(p) {
    return arguments.length ? (s = p, B) : s;
  }, function(p, v) {
    return n = p, i = v, w();
  };
}
function aD() {
  return iD()(Ga, Ga);
}
function oD(A, e, t, n) {
  var i = cH(A, e, t), s;
  switch (n = oc(n ?? ",f"), n.type) {
    case "s": {
      var l = Math.max(Math.abs(A), Math.abs(e));
      return n.precision == null && !isNaN(s = JT(i, l)) && (n.precision = s), r0(n, l);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      n.precision == null && !isNaN(s = jT(i, Math.max(Math.abs(A), Math.abs(e)))) && (n.precision = s - (n.type === "e"));
      break;
    }
    case "f":
    case "%": {
      n.precision == null && !isNaN(s = zT(i)) && (n.precision = s - (n.type === "%") * 2);
      break;
    }
  }
  return n0(n);
}
function sD(A) {
  var e = A.domain;
  return A.ticks = function(t) {
    var n = e();
    return lH(n[0], n[n.length - 1], t ?? 10);
  }, A.tickFormat = function(t, n) {
    var i = e();
    return oD(i[0], i[i.length - 1], t ?? 10, n);
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
function oa() {
  var A = aD();
  return A.copy = function() {
    return rD(A, oa());
  }, YT.apply(A, arguments), sD(A);
}
const il = (A) => () => A;
function uD(A, {
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
function Mr(A, e, t) {
  this.k = A, this.x = e, this.y = t;
}
Mr.prototype = {
  constructor: Mr,
  scale: function(A) {
    return A === 1 ? this : new Mr(this.k * A, this.x, this.y);
  },
  translate: function(A, e) {
    return A === 0 & e === 0 ? this : new Mr(this.k, this.x + this.k * A, this.y + this.k * e);
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
var Ip = new Mr(1, 0, 0);
Gi.prototype = Mr.prototype;
function Gi(A) {
  for (; !A.__zoom; ) if (!(A = A.parentNode)) return Ip;
  return A.__zoom;
}
function sh(A) {
  A.stopImmediatePropagation();
}
function Wo(A) {
  A.preventDefault(), A.stopImmediatePropagation();
}
function lD(A) {
  return (!A.ctrlKey || A.type === "wheel") && !A.button;
}
function cD() {
  var A = this;
  return A instanceof SVGElement ? (A = A.ownerSVGElement || A, A.hasAttribute("viewBox") ? (A = A.viewBox.baseVal, [[A.x, A.y], [A.x + A.width, A.y + A.height]]) : [[0, 0], [A.width.baseVal.value, A.height.baseVal.value]]) : [[0, 0], [A.clientWidth, A.clientHeight]];
}
function Uw() {
  return this.__zoom || Ip;
}
function fD(A) {
  return -A.deltaY * (A.deltaMode === 1 ? 0.05 : A.deltaMode ? 1 : 2e-3) * (A.ctrlKey ? 10 : 1);
}
function hD() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function dD(A, e, t) {
  var n = A.invertX(e[0][0]) - t[0][0], i = A.invertX(e[1][0]) - t[1][0], s = A.invertY(e[0][1]) - t[0][1], l = A.invertY(e[1][1]) - t[1][1];
  return A.translate(
    i > n ? (n + i) / 2 : Math.min(0, n) || Math.max(0, i),
    l > s ? (s + l) / 2 : Math.min(0, s) || Math.max(0, l)
  );
}
function pD() {
  var A = lD, e = cD, t = dD, n = fD, i = hD, s = [0, 1 / 0], l = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], f = 250, c = xL, h = Ec("start", "zoom", "end"), w, B, p, v = 500, o = 150, C = 0, F = 10;
  function U(q) {
    q.property("__zoom", Uw).on("wheel.zoom", hA, { passive: !1 }).on("mousedown.zoom", cA).on("dblclick.zoom", wA).filter(i).on("touchstart.zoom", QA).on("touchmove.zoom", OA).on("touchend.zoom touchcancel.zoom", EA).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  U.transform = function(q, CA, iA, gA) {
    var IA = q.selection ? q.selection() : q;
    IA.property("__zoom", Uw), q !== IA ? M(q, CA, iA, gA) : IA.interrupt().each(function() {
      K(this, arguments).event(gA).start().zoom(null, typeof CA == "function" ? CA.apply(this, arguments) : CA).end();
    });
  }, U.scaleBy = function(q, CA, iA, gA) {
    U.scaleTo(q, function() {
      var IA = this.__zoom.k, HA = typeof CA == "function" ? CA.apply(this, arguments) : CA;
      return IA * HA;
    }, iA, gA);
  }, U.scaleTo = function(q, CA, iA, gA) {
    U.transform(q, function() {
      var IA = e.apply(this, arguments), HA = this.__zoom, uA = iA == null ? E(IA) : typeof iA == "function" ? iA.apply(this, arguments) : iA, T = HA.invert(uA), rA = typeof CA == "function" ? CA.apply(this, arguments) : CA;
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
      var HA = e.apply(this, arguments), uA = this.__zoom, T = gA == null ? E(HA) : typeof gA == "function" ? gA.apply(this, arguments) : gA;
      return t(Ip.translate(T[0], T[1]).scale(uA.k).translate(
        typeof CA == "function" ? -CA.apply(this, arguments) : -CA,
        typeof iA == "function" ? -iA.apply(this, arguments) : -iA
      ), HA, l);
    }, gA, IA);
  };
  function H(q, CA) {
    return CA = Math.max(s[0], Math.min(s[1], CA)), CA === q.k ? q : new Mr(CA, q.x, q.y);
  }
  function D(q, CA, iA) {
    var gA = CA[0] - iA[0] * q.k, IA = CA[1] - iA[1] * q.k;
    return gA === q.x && IA === q.y ? q : new Mr(q.k, gA, IA);
  }
  function E(q) {
    return [(+q[0][0] + +q[1][0]) / 2, (+q[0][1] + +q[1][1]) / 2];
  }
  function M(q, CA, iA, gA) {
    q.on("start.zoom", function() {
      K(this, arguments).event(gA).start();
    }).on("interrupt.zoom end.zoom", function() {
      K(this, arguments).event(gA).end();
    }).tween("zoom", function() {
      var IA = this, HA = arguments, uA = K(IA, HA).event(gA), T = e.apply(IA, HA), rA = iA == null ? E(T) : typeof iA == "function" ? iA.apply(IA, HA) : iA, j = Math.max(T[1][0] - T[0][0], T[1][1] - T[0][1]), S = IA.__zoom, R = typeof CA == "function" ? CA.apply(IA, HA) : CA, aA = c(S.invert(rA).concat(j / S.k), R.invert(rA).concat(j / R.k));
      return function(bA) {
        if (bA === 1) bA = R;
        else {
          var _A = aA(bA), zA = j / _A[2];
          bA = new Mr(zA, rA[0] - _A[0] * zA, rA[1] - _A[1] * zA);
        }
        uA.zoom(null, bA);
      };
    });
  }
  function K(q, CA, iA) {
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
      var CA = WA(this.that).datum();
      h.call(
        q,
        this.that,
        new uD(q, {
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
    var iA = K(this, CA).event(q), gA = this.__zoom, IA = Math.max(s[0], Math.min(s[1], gA.k * Math.pow(2, n.apply(this, arguments)))), HA = kn(q);
    if (iA.wheel)
      (iA.mouse[0][0] !== HA[0] || iA.mouse[0][1] !== HA[1]) && (iA.mouse[1] = gA.invert(iA.mouse[0] = HA)), clearTimeout(iA.wheel);
    else {
      if (gA.k === IA) return;
      iA.mouse = [HA, gA.invert(HA)], Rl(this), iA.start();
    }
    Wo(q), iA.wheel = setTimeout(uA, o), iA.zoom("mouse", t(D(H(gA, IA), iA.mouse[0], iA.mouse[1]), iA.extent, l));
    function uA() {
      iA.wheel = null, iA.end();
    }
  }
  function cA(q, ...CA) {
    if (p || !A.apply(this, arguments)) return;
    var iA = q.currentTarget, gA = K(this, CA, !0).event(q), IA = WA(q.view).on("mousemove.zoom", rA, !0).on("mouseup.zoom", j, !0), HA = kn(q, iA), uA = q.clientX, T = q.clientY;
    Rv(q.view), sh(q), gA.mouse = [HA, this.__zoom.invert(HA)], Rl(this), gA.start();
    function rA(S) {
      if (Wo(S), !gA.moved) {
        var R = S.clientX - uA, aA = S.clientY - T;
        gA.moved = R * R + aA * aA > C;
      }
      gA.event(S).zoom("mouse", t(D(gA.that.__zoom, gA.mouse[0] = kn(S, iA), gA.mouse[1]), gA.extent, l));
    }
    function j(S) {
      IA.on("mousemove.zoom mouseup.zoom", null), kv(S.view, gA.moved), Wo(S), gA.event(S).end();
    }
  }
  function wA(q, ...CA) {
    if (A.apply(this, arguments)) {
      var iA = this.__zoom, gA = kn(q.changedTouches ? q.changedTouches[0] : q, this), IA = iA.invert(gA), HA = iA.k * (q.shiftKey ? 0.5 : 2), uA = t(D(H(iA, HA), gA, IA), e.apply(this, CA), l);
      Wo(q), f > 0 ? WA(this).transition().duration(f).call(M, uA, gA, q) : WA(this).call(U.transform, uA, gA, q);
    }
  }
  function QA(q, ...CA) {
    if (A.apply(this, arguments)) {
      var iA = q.touches, gA = iA.length, IA = K(this, CA, q.changedTouches.length === gA).event(q), HA, uA, T, rA;
      for (sh(q), uA = 0; uA < gA; ++uA)
        T = iA[uA], rA = kn(T, this), rA = [rA, this.__zoom.invert(rA), T.identifier], IA.touch0 ? !IA.touch1 && IA.touch0[2] !== rA[2] && (IA.touch1 = rA, IA.taps = 0) : (IA.touch0 = rA, HA = !0, IA.taps = 1 + !!w);
      w && (w = clearTimeout(w)), HA && (IA.taps < 2 && (B = rA[0], w = setTimeout(function() {
        w = null;
      }, v)), Rl(this), IA.start());
    }
  }
  function OA(q, ...CA) {
    if (this.__zooming) {
      var iA = K(this, CA).event(q), gA = q.changedTouches, IA = gA.length, HA, uA, T, rA;
      for (Wo(q), HA = 0; HA < IA; ++HA)
        uA = gA[HA], T = kn(uA, this), iA.touch0 && iA.touch0[2] === uA.identifier ? iA.touch0[0] = T : iA.touch1 && iA.touch1[2] === uA.identifier && (iA.touch1[0] = T);
      if (uA = iA.that.__zoom, iA.touch1) {
        var j = iA.touch0[0], S = iA.touch0[1], R = iA.touch1[0], aA = iA.touch1[1], bA = (bA = R[0] - j[0]) * bA + (bA = R[1] - j[1]) * bA, _A = (_A = aA[0] - S[0]) * _A + (_A = aA[1] - S[1]) * _A;
        uA = H(uA, Math.sqrt(bA / _A)), T = [(j[0] + R[0]) / 2, (j[1] + R[1]) / 2], rA = [(S[0] + aA[0]) / 2, (S[1] + aA[1]) / 2];
      } else if (iA.touch0) T = iA.touch0[0], rA = iA.touch0[1];
      else return;
      iA.zoom("touch", t(D(uA, T, rA), iA.extent, l));
    }
  }
  function EA(q, ...CA) {
    if (this.__zooming) {
      var iA = K(this, CA).event(q), gA = q.changedTouches, IA = gA.length, HA, uA;
      for (sh(q), p && clearTimeout(p), p = setTimeout(function() {
        p = null;
      }, v), HA = 0; HA < IA; ++HA)
        uA = gA[HA], iA.touch0 && iA.touch0[2] === uA.identifier ? delete iA.touch0 : iA.touch1 && iA.touch1[2] === uA.identifier && delete iA.touch1;
      if (iA.touch1 && !iA.touch0 && (iA.touch0 = iA.touch1, delete iA.touch1), iA.touch0) iA.touch0[1] = this.__zoom.invert(iA.touch0[0]);
      else if (iA.end(), iA.taps === 2 && (uA = kn(uA, this), Math.hypot(B[0] - uA[0], B[1] - uA[1]) < F)) {
        var T = WA(this).on("dblclick.zoom");
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
var i0 = { exports: {} };
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
      var u, d, m, y, b, _, I = arguments[0] || {}, P = 1, z = arguments.length, Y = !1;
      for (typeof I == "boolean" && (Y = I, I = arguments[P] || {}, P++), typeof I != "object" && !o.isFunction(I) && (I = {}), P === z && (I = this, P--); P < z; P++)
        if ((b = arguments[P]) != null)
          for (y in b)
            u = I[y], m = b[y], I !== m && (Y && m && (o.isPlainObject(m) || (d = o.isArray(m))) ? (d ? (d = !1, _ = u && o.isArray(u) ? u : []) : _ = u && o.isPlainObject(u) ? u : {}, I[y] = o.extend(Y, _, m)) : m !== void 0 && (I[y] = m));
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
        for (var m = +d.length, y = 0, b = u.length; y < m; )
          u[b++] = d[y++];
        if (m !== m)
          for (; d[y] !== void 0; )
            u[b++] = d[y++];
        return u.length = b, u;
      },
      grep: function(u, d, m) {
        for (var y, b = [], _ = 0, I = u.length, P = !m; _ < I; _++)
          y = !d(u[_], _), y !== P && b.push(u[_]);
        return b;
      },
      // arg is for internal usage only
      map: function(u, d, m) {
        var y, b, _ = 0, I = [];
        if (D(u))
          for (y = u.length; _ < y; _++)
            b = d(u[_], _, m), b != null && I.push(b);
        else
          for (_ in u)
            b = d(u[_], _, m), b != null && I.push(b);
        return l.apply([], I);
      },
      // A global GUID counter for objects
      guid: 1,
      // Bind a function to a context, optionally partially applying any
      // arguments.
      proxy: function(u, d) {
        var m, y, b;
        if (typeof d == "string" && (b = u[d], d = u, u = b), !!o.isFunction(u))
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
    var E = (
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
        var d, m, y, b, _, I, P, z, Y, nA, FA, LA, UA, re, ZA, oe, ft, qe, Jn, kA = "sizzle" + 1 * /* @__PURE__ */ new Date(), st = u.document, ue = 0, We = 0, xn = AA(), va = AA(), _t = AA(), In = function(N, G) {
          return N === G && (FA = !0), 0;
        }, jn = 1 << 31, Hn = {}.hasOwnProperty, Ke = [], xt = Ke.pop, Hi = Ke.push, Sn = Ke.push, Uo = Ke.slice, mr = function(N, G) {
          for (var Z = 0, dA = N.length; Z < dA; Z++)
            if (N[Z] === G)
              return Z;
          return -1;
        }, bo = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", De = "[\\x20\\t\\r\\n\\f]", vr = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", Bu = "\\[" + De + "*(" + vr + ")(?:" + De + // Operator (capture 2)
        "*([*^$|!~]?=)" + De + // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
        `*(?:'((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)"|(` + vr + "))|)" + De + "*\\]", Yn = ":(" + vr + `)(?:\\((('((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|` + Bu + ")*)|.*)\\)|)", nf = new RegExp(De + "+", "g"), ya = new RegExp("^" + De + "+|((?:^|[^\\\\])(?:\\\\.)*)" + De + "+$", "g"), Eo = new RegExp("^" + De + "*," + De + "*"), wu = new RegExp("^" + De + "*([>+~]|" + De + ")" + De + "*"), Zn = new RegExp("=" + De + `*([^\\]'"]*?)` + De + "*\\]", "g"), Ca = new RegExp(Yn), mu = new RegExp("^" + vr + "$"), Qa = {
          ID: new RegExp("^#(" + vr + ")"),
          CLASS: new RegExp("^\\.(" + vr + ")"),
          TAG: new RegExp("^(" + vr + "|[*])"),
          ATTR: new RegExp("^" + Bu),
          PSEUDO: new RegExp("^" + Yn),
          CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + De + "*(even|odd|(([+-]|)(\\d*)n|)" + De + "*(?:([+-]|)" + De + "*(\\d+)|))" + De + "*\\)|)", "i"),
          bool: new RegExp("^(?:" + bo + ")$", "i"),
          // For use in libraries implementing .is()
          // We use this for POS matching in `select`
          needsContext: new RegExp("^" + De + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + De + "*((?:-\\d)?\\d*)" + De + "*\\)|)(?=[^-]|$)", "i")
        }, rf = /^(?:input|select|textarea|button)$/i, Ai = /^h\d$/i, Bt = /^[^{]+\{\s*\[native \w/, vu = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, _o = /[+~]/, af = /'|\\/g, Ln = new RegExp("\\\\([\\da-f]{1,6}" + De + "?|(" + De + ")|.)", "ig"), Tn = function(N, G, Z) {
          var dA = "0x" + G - 65536;
          return dA !== dA || Z ? G : dA < 0 ? (
            // BMP codepoint
            String.fromCharCode(dA + 65536)
          ) : (
            // Supplemental Plane codepoint (surrogate pair)
            String.fromCharCode(dA >> 10 | 55296, dA & 1023 | 56320)
          );
        }, yu = function() {
          LA();
        };
        try {
          Sn.apply(
            Ke = Uo.call(st.childNodes),
            st.childNodes
          ), Ke[st.childNodes.length].nodeType;
        } catch {
          Sn = {
            apply: Ke.length ? (
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
          var oA, yA, BA, SA, GA, ne, VA, Ae, de = G && G.ownerDocument, Le = G ? G.nodeType : 9;
          if (Z = Z || [], typeof N != "string" || !N || Le !== 1 && Le !== 9 && Le !== 11)
            return Z;
          if (!dA && ((G ? G.ownerDocument || G : st) !== UA && LA(G), G = G || UA, ZA)) {
            if (Le !== 11 && (ne = vu.exec(N)))
              if (oA = ne[1]) {
                if (Le === 9)
                  if (BA = G.getElementById(oA)) {
                    if (BA.id === oA)
                      return Z.push(BA), Z;
                  } else
                    return Z;
                else if (de && (BA = de.getElementById(oA)) && Jn(G, BA) && BA.id === oA)
                  return Z.push(BA), Z;
              } else {
                if (ne[2])
                  return Sn.apply(Z, G.getElementsByTagName(N)), Z;
                if ((oA = ne[3]) && m.getElementsByClassName && G.getElementsByClassName)
                  return Sn.apply(Z, G.getElementsByClassName(oA)), Z;
              }
            if (m.qsa && !_t[N + " "] && (!oe || !oe.test(N))) {
              if (Le !== 1)
                de = G, Ae = N;
              else if (G.nodeName.toLowerCase() !== "object") {
                for ((SA = G.getAttribute("id")) ? SA = SA.replace(af, "\\$&") : G.setAttribute("id", SA = kA), VA = I(N), yA = VA.length, GA = mu.test(SA) ? "#" + SA : "[id='" + SA + "']"; yA--; )
                  VA[yA] = GA + " " + wt(VA[yA]);
                Ae = VA.join(","), de = _o.test(N) && Si(G.parentNode) || G;
              }
              if (Ae)
                try {
                  return Sn.apply(
                    Z,
                    de.querySelectorAll(Ae)
                  ), Z;
                } catch {
                } finally {
                  SA === kA && G.removeAttribute("id");
                }
            }
          }
          return z(N.replace(ya, "$1"), G, Z, dA);
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
        function ie(N, G) {
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
        function Ze(N) {
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
        }, LA = Ie.setDocument = function(N) {
          var G, Z, dA = N ? N.ownerDocument || N : st;
          return dA === UA || dA.nodeType !== 9 || !dA.documentElement || (UA = dA, re = UA.documentElement, ZA = !_(UA), (Z = UA.defaultView) && Z.top !== Z && (Z.addEventListener ? Z.addEventListener("unload", yu, !1) : Z.attachEvent && Z.attachEvent("onunload", yu)), m.attributes = sA(function(oA) {
            return oA.className = "i", !oA.getAttribute("className");
          }), m.getElementsByTagName = sA(function(oA) {
            return oA.appendChild(UA.createComment("")), !oA.getElementsByTagName("*").length;
          }), m.getElementsByClassName = Bt.test(UA.getElementsByClassName), m.getById = sA(function(oA) {
            return re.appendChild(oA).id = kA, !UA.getElementsByName || !UA.getElementsByName(kA).length;
          }), m.getById ? (y.find.ID = function(oA, yA) {
            if (typeof yA.getElementById < "u" && ZA) {
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
              var SA = typeof BA.getAttributeNode < "u" && BA.getAttributeNode("id");
              return SA && SA.value === yA;
            };
          }), y.find.TAG = m.getElementsByTagName ? function(oA, yA) {
            if (typeof yA.getElementsByTagName < "u")
              return yA.getElementsByTagName(oA);
            if (m.qsa)
              return yA.querySelectorAll(oA);
          } : function(oA, yA) {
            var BA, SA = [], GA = 0, ne = yA.getElementsByTagName(oA);
            if (oA === "*") {
              for (; BA = ne[GA++]; )
                BA.nodeType === 1 && SA.push(BA);
              return SA;
            }
            return ne;
          }, y.find.CLASS = m.getElementsByClassName && function(oA, yA) {
            if (typeof yA.getElementsByClassName < "u" && ZA)
              return yA.getElementsByClassName(oA);
          }, ft = [], oe = [], (m.qsa = Bt.test(UA.querySelectorAll)) && (sA(function(oA) {
            re.appendChild(oA).innerHTML = "<a id='" + kA + "'></a><select id='" + kA + "-\r\\' msallowcapture=''><option selected=''></option></select>", oA.querySelectorAll("[msallowcapture^='']").length && oe.push("[*^$]=" + De + `*(?:''|"")`), oA.querySelectorAll("[selected]").length || oe.push("\\[" + De + "*(?:value|" + bo + ")"), oA.querySelectorAll("[id~=" + kA + "-]").length || oe.push("~="), oA.querySelectorAll(":checked").length || oe.push(":checked"), oA.querySelectorAll("a#" + kA + "+*").length || oe.push(".#.+[+~]");
          }), sA(function(oA) {
            var yA = UA.createElement("input");
            yA.setAttribute("type", "hidden"), oA.appendChild(yA).setAttribute("name", "D"), oA.querySelectorAll("[name=d]").length && oe.push("name" + De + "*[*^$|!~]?="), oA.querySelectorAll(":enabled").length || oe.push(":enabled", ":disabled"), oA.querySelectorAll("*,:x"), oe.push(",.*:");
          })), (m.matchesSelector = Bt.test(qe = re.matches || re.webkitMatchesSelector || re.mozMatchesSelector || re.oMatchesSelector || re.msMatchesSelector)) && sA(function(oA) {
            m.disconnectedMatch = qe.call(oA, "div"), qe.call(oA, "[s!='']:x"), ft.push("!=", Yn);
          }), oe = oe.length && new RegExp(oe.join("|")), ft = ft.length && new RegExp(ft.join("|")), G = Bt.test(re.compareDocumentPosition), Jn = G || Bt.test(re.contains) ? function(oA, yA) {
            var BA = oA.nodeType === 9 ? oA.documentElement : oA, SA = yA && yA.parentNode;
            return oA === SA || !!(SA && SA.nodeType === 1 && (BA.contains ? BA.contains(SA) : oA.compareDocumentPosition && oA.compareDocumentPosition(SA) & 16));
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
            ), BA & 1 || !m.sortDetached && yA.compareDocumentPosition(oA) === BA ? oA === UA || oA.ownerDocument === st && Jn(st, oA) ? -1 : yA === UA || yA.ownerDocument === st && Jn(st, yA) ? 1 : nA ? mr(nA, oA) - mr(nA, yA) : 0 : BA & 4 ? -1 : 1);
          } : function(oA, yA) {
            if (oA === yA)
              return FA = !0, 0;
            var BA, SA = 0, GA = oA.parentNode, ne = yA.parentNode, VA = [oA], Ae = [yA];
            if (!GA || !ne)
              return oA === UA ? -1 : yA === UA ? 1 : GA ? -1 : ne ? 1 : nA ? mr(nA, oA) - mr(nA, yA) : 0;
            if (GA === ne)
              return ie(oA, yA);
            for (BA = oA; BA = BA.parentNode; )
              VA.unshift(BA);
            for (BA = yA; BA = BA.parentNode; )
              Ae.unshift(BA);
            for (; VA[SA] === Ae[SA]; )
              SA++;
            return SA ? (
              // Do a sibling check if the nodes have a common ancestor
              ie(VA[SA], Ae[SA])
            ) : (
              // Otherwise nodes in our document sort first
              VA[SA] === st ? -1 : Ae[SA] === st ? 1 : 0
            );
          }), UA;
        }, Ie.matches = function(N, G) {
          return Ie(N, null, null, G);
        }, Ie.matchesSelector = function(N, G) {
          if ((N.ownerDocument || N) !== UA && LA(N), G = G.replace(Zn, "='$1']"), m.matchesSelector && ZA && !_t[G + " "] && (!ft || !ft.test(G)) && (!oe || !oe.test(G)))
            try {
              var Z = qe.call(N, G);
              if (Z || m.disconnectedMatch || // As well, disconnected nodes are said to be in a document
              // fragment in IE 9
              N.document && N.document.nodeType !== 11)
                return Z;
            } catch {
            }
          return Ie(G, UA, null, [N]).length > 0;
        }, Ie.contains = function(N, G) {
          return (N.ownerDocument || N) !== UA && LA(N), Jn(N, G);
        }, Ie.attr = function(N, G) {
          (N.ownerDocument || N) !== UA && LA(N);
          var Z = y.attrHandle[G.toLowerCase()], dA = Z && Hn.call(y.attrHandle, G.toLowerCase()) ? Z(N, G, !ZA) : void 0;
          return dA !== void 0 ? dA : m.attributes || !ZA ? N.getAttribute(G) : (dA = N.getAttributeNode(G)) && dA.specified ? dA.value : null;
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
        }, b = Ie.getText = function(N) {
          var G, Z = "", dA = 0, oA = N.nodeType;
          if (oA) {
            if (oA === 1 || oA === 9 || oA === 11) {
              if (typeof N.textContent == "string")
                return N.textContent;
              for (N = N.firstChild; N; N = N.nextSibling)
                Z += b(N);
            } else if (oA === 3 || oA === 4)
              return N.nodeValue;
          } else for (; G = N[dA++]; )
            Z += b(G);
          return Z;
        }, y = Ie.selectors = {
          // Can be adjusted by the user
          cacheLength: 50,
          createPseudo: fA,
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
            ATTR: function(N) {
              return N[1] = N[1].replace(Ln, Tn), N[3] = (N[3] || N[4] || N[5] || "").replace(Ln, Tn), N[2] === "~=" && (N[3] = " " + N[3] + " "), N.slice(0, 4);
            },
            CHILD: function(N) {
              return N[1] = N[1].toLowerCase(), N[1].slice(0, 3) === "nth" ? (N[3] || Ie.error(N[0]), N[4] = +(N[4] ? N[5] + (N[6] || 1) : 2 * (N[3] === "even" || N[3] === "odd")), N[5] = +(N[7] + N[8] || N[3] === "odd")) : N[3] && Ie.error(N[0]), N;
            },
            PSEUDO: function(N) {
              var G, Z = !N[6] && N[2];
              return Qa.CHILD.test(N[0]) ? null : (N[3] ? N[2] = N[4] || N[5] || "" : Z && Ca.test(Z) && // Get excess from tokenize (recursively)
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
              var yA = N.slice(0, 3) !== "nth", BA = N.slice(-4) !== "last", SA = G === "of-type";
              return dA === 1 && oA === 0 ? (
                // Shortcut for :nth-*(n)
                function(GA) {
                  return !!GA.parentNode;
                }
              ) : function(GA, ne, VA) {
                var Ae, de, Le, qA, ke, At, Mt = yA !== BA ? "nextSibling" : "previousSibling", Ge = GA.parentNode, Li = SA && GA.nodeName.toLowerCase(), Ar = !VA && !SA, ht = !1;
                if (Ge) {
                  if (yA) {
                    for (; Mt; ) {
                      for (qA = GA; qA = qA[Mt]; )
                        if (SA ? qA.nodeName.toLowerCase() === Li : qA.nodeType === 1)
                          return !1;
                      At = Mt = N === "only" && !At && "nextSibling";
                    }
                    return !0;
                  }
                  if (At = [BA ? Ge.firstChild : Ge.lastChild], BA && Ar) {
                    for (qA = Ge, Le = qA[kA] || (qA[kA] = {}), de = Le[qA.uniqueID] || (Le[qA.uniqueID] = {}), Ae = de[N] || [], ke = Ae[0] === ue && Ae[1], ht = ke && Ae[2], qA = ke && Ge.childNodes[ke]; qA = ++ke && qA && qA[Mt] || // Fallback to seeking `elem` from the start
                    (ht = ke = 0) || At.pop(); )
                      if (qA.nodeType === 1 && ++ht && qA === GA) {
                        de[N] = [ue, ke, ht];
                        break;
                      }
                  } else if (Ar && (qA = GA, Le = qA[kA] || (qA[kA] = {}), de = Le[qA.uniqueID] || (Le[qA.uniqueID] = {}), Ae = de[N] || [], ke = Ae[0] === ue && Ae[1], ht = ke), ht === !1)
                    for (; (qA = ++ke && qA && qA[Mt] || (ht = ke = 0) || At.pop()) && !((SA ? qA.nodeName.toLowerCase() === Li : qA.nodeType === 1) && ++ht && (Ar && (Le = qA[kA] || (qA[kA] = {}), de = Le[qA.uniqueID] || (Le[qA.uniqueID] = {}), de[N] = [ue, ht]), qA === GA)); )
                      ;
                  return ht -= oA, ht === dA || ht % dA === 0 && ht / dA >= 0;
                }
              };
            },
            PSEUDO: function(N, G) {
              var Z, dA = y.pseudos[N] || y.setFilters[N.toLowerCase()] || Ie.error("unsupported pseudo: " + N);
              return dA[kA] ? dA(G) : dA.length > 1 ? (Z = [N, N, "", G], y.setFilters.hasOwnProperty(N.toLowerCase()) ? fA(function(oA, yA) {
                for (var BA, SA = dA(oA, G), GA = SA.length; GA--; )
                  BA = mr(oA, SA[GA]), oA[BA] = !(yA[BA] = SA[GA]);
              }) : function(oA) {
                return dA(oA, 0, Z);
              }) : dA;
            }
          },
          pseudos: {
            // Potentially complex pseudos
            not: fA(function(N) {
              var G = [], Z = [], dA = P(N.replace(ya, "$1"));
              return dA[kA] ? fA(function(oA, yA, BA, SA) {
                for (var GA, ne = dA(oA, null, SA, []), VA = oA.length; VA--; )
                  (GA = ne[VA]) && (oA[VA] = !(yA[VA] = GA));
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
                return (G.textContent || G.innerText || b(G)).indexOf(N) > -1;
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
              return mu.test(N || "") || Ie.error("unsupported lang: " + N), N = N.replace(Ln, Tn).toLowerCase(), function(G) {
                var Z;
                do
                  if (Z = ZA ? G.lang : G.getAttribute("xml:lang") || G.getAttribute("lang"))
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
              return N === re;
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
          y.pseudos[d] = Ze(d);
        function Cu() {
        }
        Cu.prototype = y.filters = y.pseudos, y.setFilters = new Cu(), I = Ie.tokenize = function(N, G) {
          var Z, dA, oA, yA, BA, SA, GA, ne = va[N + " "];
          if (ne)
            return G ? 0 : ne.slice(0);
          for (BA = N, SA = [], GA = y.preFilter; BA; ) {
            (!Z || (dA = Eo.exec(BA))) && (dA && (BA = BA.slice(dA[0].length) || BA), SA.push(oA = [])), Z = !1, (dA = wu.exec(BA)) && (Z = dA.shift(), oA.push({
              value: Z,
              // Cast descendant combinators to space
              type: dA[0].replace(ya, " ")
            }), BA = BA.slice(Z.length));
            for (yA in y.filter)
              (dA = Qa[yA].exec(BA)) && (!GA[yA] || (dA = GA[yA](dA))) && (Z = dA.shift(), oA.push({
                value: Z,
                type: yA,
                matches: dA
              }), BA = BA.slice(Z.length));
            if (!Z)
              break;
          }
          return G ? BA.length : BA ? Ie.error(N) : (
            // Cache the tokens
            va(N, SA).slice(0)
          );
        };
        function wt(N) {
          for (var G = 0, Z = N.length, dA = ""; G < Z; G++)
            dA += N[G].value;
          return dA;
        }
        function ei(N, G, Z) {
          var dA = G.dir, oA = Z && dA === "parentNode", yA = We++;
          return G.first ? (
            // Check against closest ancestor/preceding element
            function(BA, SA, GA) {
              for (; BA = BA[dA]; )
                if (BA.nodeType === 1 || oA)
                  return N(BA, SA, GA);
            }
          ) : (
            // Check against all ancestor/preceding elements
            function(BA, SA, GA) {
              var ne, VA, Ae, de = [ue, yA];
              if (GA) {
                for (; BA = BA[dA]; )
                  if ((BA.nodeType === 1 || oA) && N(BA, SA, GA))
                    return !0;
              } else
                for (; BA = BA[dA]; )
                  if (BA.nodeType === 1 || oA) {
                    if (Ae = BA[kA] || (BA[kA] = {}), VA = Ae[BA.uniqueID] || (Ae[BA.uniqueID] = {}), (ne = VA[dA]) && ne[0] === ue && ne[1] === yA)
                      return de[2] = ne[2];
                    if (VA[dA] = de, de[2] = N(BA, SA, GA))
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
          for (var yA, BA = [], SA = 0, GA = N.length, ne = G != null; SA < GA; SA++)
            (yA = N[SA]) && (!Z || Z(yA, dA, oA)) && (BA.push(yA), ne && G.push(SA));
          return BA;
        }
        function ni(N, G, Z, dA, oA, yA) {
          return dA && !dA[kA] && (dA = ni(dA)), oA && !oA[kA] && (oA = ni(oA, yA)), fA(function(BA, SA, GA, ne) {
            var VA, Ae, de, Le = [], qA = [], ke = SA.length, At = BA || ti(G || "*", GA.nodeType ? [GA] : GA, []), Mt = N && (BA || !G) ? yr(At, Le, N, GA, ne) : At, Ge = Z ? (
              // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
              oA || (BA ? N : ke || dA) ? (
                // ...intermediate processing is necessary
                []
              ) : (
                // ...otherwise use results directly
                SA
              )
            ) : Mt;
            if (Z && Z(Mt, Ge, GA, ne), dA)
              for (VA = yr(Ge, qA), dA(VA, [], GA, ne), Ae = VA.length; Ae--; )
                (de = VA[Ae]) && (Ge[qA[Ae]] = !(Mt[qA[Ae]] = de));
            if (BA) {
              if (oA || N) {
                if (oA) {
                  for (VA = [], Ae = Ge.length; Ae--; )
                    (de = Ge[Ae]) && VA.push(Mt[Ae] = de);
                  oA(null, Ge = [], VA, ne);
                }
                for (Ae = Ge.length; Ae--; )
                  (de = Ge[Ae]) && (VA = oA ? mr(BA, de) : Le[Ae]) > -1 && (BA[VA] = !(SA[VA] = de));
              }
            } else
              Ge = yr(
                Ge === SA ? Ge.splice(ke, Ge.length) : Ge
              ), oA ? oA(null, SA, Ge, ne) : Sn.apply(SA, Ge);
          });
        }
        function Se(N) {
          for (var G, Z, dA, oA = N.length, yA = y.relative[N[0].type], BA = yA || y.relative[" "], SA = yA ? 1 : 0, GA = ei(function(Ae) {
            return Ae === G;
          }, BA, !0), ne = ei(function(Ae) {
            return mr(G, Ae) > -1;
          }, BA, !0), VA = [function(Ae, de, Le) {
            var qA = !yA && (Le || de !== Y) || ((G = de).nodeType ? GA(Ae, de, Le) : ne(Ae, de, Le));
            return G = null, qA;
          }]; SA < oA; SA++)
            if (Z = y.relative[N[SA].type])
              VA = [ei(xo(VA), Z)];
            else {
              if (Z = y.filter[N[SA].type].apply(null, N[SA].matches), Z[kA]) {
                for (dA = ++SA; dA < oA && !y.relative[N[dA].type]; dA++)
                  ;
                return ni(
                  SA > 1 && xo(VA),
                  SA > 1 && wt(
                    // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                    N.slice(0, SA - 1).concat({ value: N[SA - 2].type === " " ? "*" : "" })
                  ).replace(ya, "$1"),
                  Z,
                  SA < dA && Se(N.slice(SA, dA)),
                  dA < oA && Se(N = N.slice(dA)),
                  dA < oA && wt(N)
                );
              }
              VA.push(Z);
            }
          return xo(VA);
        }
        function of(N, G) {
          var Z = G.length > 0, dA = N.length > 0, oA = function(yA, BA, SA, GA, ne) {
            var VA, Ae, de, Le = 0, qA = "0", ke = yA && [], At = [], Mt = Y, Ge = yA || dA && y.find.TAG("*", ne), Li = ue += Mt == null ? 1 : Math.random() || 0.1, Ar = Ge.length;
            for (ne && (Y = BA === UA || BA || ne); qA !== Ar && (VA = Ge[qA]) != null; qA++) {
              if (dA && VA) {
                for (Ae = 0, !BA && VA.ownerDocument !== UA && (LA(VA), SA = !ZA); de = N[Ae++]; )
                  if (de(VA, BA || UA, SA)) {
                    GA.push(VA);
                    break;
                  }
                ne && (ue = Li);
              }
              Z && ((VA = !de && VA) && Le--, yA && ke.push(VA));
            }
            if (Le += qA, Z && qA !== Le) {
              for (Ae = 0; de = G[Ae++]; )
                de(ke, At, BA, SA);
              if (yA) {
                if (Le > 0)
                  for (; qA--; )
                    ke[qA] || At[qA] || (At[qA] = xt.call(GA));
                At = yr(At);
              }
              Sn.apply(GA, At), ne && !yA && At.length > 0 && Le + G.length > 1 && Ie.uniqueSort(GA);
            }
            return ne && (ue = Li, Y = Mt), ke;
          };
          return Z ? fA(oA) : oA;
        }
        return P = Ie.compile = function(N, G) {
          var Z, dA = [], oA = [], yA = _t[N + " "];
          if (!yA) {
            for (G || (G = I(N)), Z = G.length; Z--; )
              yA = Se(G[Z]), yA[kA] ? dA.push(yA) : oA.push(yA);
            yA = _t(N, of(oA, dA)), yA.selector = N;
          }
          return yA;
        }, z = Ie.select = function(N, G, Z, dA) {
          var oA, yA, BA, SA, GA, ne = typeof N == "function" && N, VA = !dA && I(N = ne.selector || N);
          if (Z = Z || [], VA.length === 1) {
            if (yA = VA[0] = VA[0].slice(0), yA.length > 2 && (BA = yA[0]).type === "ID" && m.getById && G.nodeType === 9 && ZA && y.relative[yA[1].type]) {
              if (G = (y.find.ID(BA.matches[0].replace(Ln, Tn), G) || [])[0], G)
                ne && (G = G.parentNode);
              else return Z;
              N = N.slice(yA.shift().value.length);
            }
            for (oA = Qa.needsContext.test(N) ? 0 : yA.length; oA-- && (BA = yA[oA], !y.relative[SA = BA.type]); )
              if ((GA = y.find[SA]) && (dA = GA(
                BA.matches[0].replace(Ln, Tn),
                _o.test(yA[0].type) && Si(G.parentNode) || G
              ))) {
                if (yA.splice(oA, 1), N = dA.length && wt(yA), !N)
                  return Sn.apply(Z, dA), Z;
                break;
              }
          }
          return (ne || P(N, VA))(
            dA,
            G,
            !ZA,
            Z,
            !G || _o.test(N) && Si(G.parentNode) || G
          ), Z;
        }, m.sortStable = kA.split("").sort(In).join("") === kA, m.detectDuplicates = !!FA, LA(), m.sortDetached = sA(function(N) {
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
        }) || PA(bo, function(N, G, Z) {
          var dA;
          if (!Z)
            return N[G] === !0 ? G.toLowerCase() : (dA = N.getAttributeNode(G)) && dA.specified ? dA.value : null;
        }), Ie;
      }(e)
    );
    o.find = E, o.expr = E.selectors, o.expr[":"] = o.expr.pseudos, o.uniqueSort = o.unique = E.uniqueSort, o.text = E.getText, o.isXMLDoc = E.isXML, o.contains = E.contains;
    var M = function(u, d, m) {
      for (var y = [], b = m !== void 0; (u = u[d]) && u.nodeType !== 9; )
        if (u.nodeType === 1) {
          if (b && o(u).is(m))
            break;
          y.push(u);
        }
      return y;
    }, K = function(u, d) {
      for (var m = []; u; u = u.nextSibling)
        u.nodeType === 1 && u !== d && m.push(u);
      return m;
    }, J = o.expr.match.needsContext, hA = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/, cA = /^.[^:#\[\.,]*$/;
    function wA(u, d, m) {
      if (o.isFunction(d))
        return o.grep(u, function(y, b) {
          return !!d.call(y, b, y) !== m;
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
      return m && (u = ":not(" + u + ")"), d.length === 1 && y.nodeType === 1 ? o.find.matchesSelector(y, u) ? [y] : [] : o.find.matches(u, o.grep(d, function(b) {
        return b.nodeType === 1;
      }));
    }, o.fn.extend({
      find: function(u) {
        var d, m = [], y = this, b = y.length;
        if (typeof u != "string")
          return this.pushStack(o(u).filter(function() {
            for (d = 0; d < b; d++)
              if (o.contains(y[d], this))
                return !0;
          }));
        for (d = 0; d < b; d++)
          o.find(u, y[d], m);
        return m = this.pushStack(b > 1 ? o.unique(m) : m), m.selector = this.selector ? this.selector + " " + u : u, m;
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
    var QA, OA = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, EA = o.fn.init = function(u, d, m) {
      var y, b;
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
            if (b = i.getElementById(y[2]), b && b.parentNode) {
              if (b.id !== y[2])
                return QA.find(u);
              this.length = 1, this[0] = b;
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
    EA.prototype = o.fn, QA = o(i);
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
        for (var m, y = 0, b = this.length, _ = [], I = J.test(u) || typeof u != "string" ? o(u, d || this.context) : 0; y < b; y++)
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
        return K((u.parentNode || {}).firstChild, u);
      },
      children: function(u) {
        return K(u.firstChild);
      },
      contents: function(u) {
        return o.nodeName(u, "iframe") ? u.contentDocument || u.contentWindow.document : o.merge([], u.childNodes);
      }
    }, function(u, d) {
      o.fn[u] = function(m, y) {
        var b = o.map(this, d, m);
        return u.slice(-5) !== "Until" && (y = m), y && typeof y == "string" && (b = o.filter(y, b)), this.length > 1 && (CA[u] || (b = o.uniqueSort(b)), q.test(u) && (b = b.reverse())), this.pushStack(b);
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
      var d, m, y, b, _ = [], I = [], P = -1, z = function() {
        for (b = u.once, y = d = !0; I.length; P = -1)
          for (m = I.shift(); ++P < _.length; )
            _[P].apply(m[0], m[1]) === !1 && u.stopOnFalse && (P = _.length, m = !1);
        u.memory || (m = !1), d = !1, b && (m ? _ = [] : _ = "");
      }, Y = {
        // Add a callback or a collection of callbacks to the list
        add: function() {
          return _ && (m && !d && (P = _.length - 1, I.push(m)), function nA(FA) {
            o.each(FA, function(LA, UA) {
              o.isFunction(UA) ? (!u.unique || !Y.has(UA)) && _.push(UA) : UA && UA.length && o.type(UA) !== "string" && nA(UA);
            });
          }(arguments), m && !d && z()), this;
        },
        // Remove a callback from the list
        remove: function() {
          return o.each(arguments, function(nA, FA) {
            for (var LA; (LA = o.inArray(FA, _, LA)) > -1; )
              _.splice(LA, 1), LA <= P && P--;
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
          return b = I = [], _ = m = "", this;
        },
        disabled: function() {
          return !_;
        },
        // Disable .fire
        // Also disable .add unless we have memory (since it would have no effect)
        // Abort any pending executions
        lock: function() {
          return b = !0, m || Y.disable(), this;
        },
        locked: function() {
          return !!b;
        },
        // Call all callbacks with the given context and arguments
        fireWith: function(nA, FA) {
          return b || (FA = FA || [], FA = [nA, FA.slice ? FA.slice() : FA], I.push(FA), d || z()), this;
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
            return b.done(arguments).fail(arguments), this;
          },
          then: function() {
            var _ = arguments;
            return o.Deferred(function(I) {
              o.each(d, function(P, z) {
                var Y = o.isFunction(_[P]) && _[P];
                b[z[1]](function() {
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
        }, b = {};
        return y.pipe = y.then, o.each(d, function(_, I) {
          var P = I[2], z = I[3];
          y[I[1]] = P.add, z && P.add(function() {
            m = z;
          }, d[_ ^ 1][2].disable, d[2][2].lock), b[I[0]] = function() {
            return b[I[0] + "With"](this === b ? y : this, arguments), this;
          }, b[I[0] + "With"] = P.fireWith;
        }), y.promise(b), u && u.call(b, b), b;
      },
      // Deferred helper
      when: function(u) {
        var d = 0, m = s.call(arguments), y = m.length, b = y !== 1 || u && o.isFunction(u.promise) ? y : 0, _ = b === 1 ? u : o.Deferred(), I = function(nA, FA, LA) {
          return function(UA) {
            FA[nA] = this, LA[nA] = arguments.length > 1 ? s.call(arguments) : UA, LA === P ? _.notifyWith(FA, LA) : --b || _.resolveWith(FA, LA);
          };
        }, P, z, Y;
        if (y > 1)
          for (P = new Array(y), z = new Array(y), Y = new Array(y); d < y; d++)
            m[d] && o.isFunction(m[d].promise) ? m[d].promise().progress(I(d, z, P)).done(I(d, Y, m)).fail(_.reject) : --b;
        return b || _.resolveWith(Y, m), _.promise();
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
    }, S = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, R = /([A-Z])/g;
    function aA(u, d, m) {
      if (m === void 0 && u.nodeType === 1) {
        var y = "data-" + d.replace(R, "-$1").toLowerCase();
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
    function bA(u) {
      var d;
      for (d in u)
        if (!(d === "data" && o.isEmptyObject(u[d])) && d !== "toJSON")
          return !1;
      return !0;
    }
    function _A(u, d, m, y) {
      if (j(u)) {
        var b, _, I = o.expando, P = u.nodeType, z = P ? o.cache : u, Y = P ? u[I] : u[I] && I;
        if (!((!Y || !z[Y] || !y && !z[Y].data) && m === void 0 && typeof d == "string"))
          return Y || (P ? Y = u[I] = n.pop() || o.guid++ : Y = I), z[Y] || (z[Y] = P ? {} : { toJSON: o.noop }), (typeof d == "object" || typeof d == "function") && (y ? z[Y] = o.extend(z[Y], d) : z[Y].data = o.extend(z[Y].data, d)), _ = z[Y], y || (_.data || (_.data = {}), _ = _.data), m !== void 0 && (_[o.camelCase(d)] = m), typeof d == "string" ? (b = _[d], b == null && (b = _[o.camelCase(d)])) : b = _, b;
      }
    }
    function zA(u, d, m) {
      if (j(u)) {
        var y, b, _ = u.nodeType, I = _ ? o.cache : u, P = _ ? u[o.expando] : o.expando;
        if (I[P]) {
          if (d && (y = m ? I[P] : I[P].data, y)) {
            for (o.isArray(d) ? d = d.concat(o.map(d, o.camelCase)) : (d in y) ? d = [d] : (d = o.camelCase(d), d in y ? d = [d] : d = d.split(" ")), b = d.length; b--; )
              delete y[d[b]];
            if (m ? !bA(y) : !o.isEmptyObject(y))
              return;
          }
          !m && (delete I[P].data, !bA(I[P])) || (_ ? o.cleanData([u], !0) : p.deleteExpando || I != I.window ? delete I[P] : I[P] = void 0);
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
        return u = u.nodeType ? o.cache[u[o.expando]] : u[o.expando], !!u && !bA(u);
      },
      data: function(u, d, m) {
        return _A(u, d, m);
      },
      removeData: function(u, d) {
        return zA(u, d);
      },
      // For internal use only.
      _data: function(u, d, m) {
        return _A(u, d, m, !0);
      },
      _removeData: function(u, d) {
        return zA(u, d, !0);
      }
    }), o.fn.extend({
      data: function(u, d) {
        var m, y, b, _ = this[0], I = _ && _.attributes;
        if (u === void 0) {
          if (this.length && (b = o.data(_), _.nodeType === 1 && !o._data(_, "parsedAttrs"))) {
            for (m = I.length; m--; )
              I[m] && (y = I[m].name, y.indexOf("data-") === 0 && (y = o.camelCase(y.slice(5)), aA(_, y, b[y])));
            o._data(_, "parsedAttrs", !0);
          }
          return b;
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
        var m = o.queue(u, d), y = m.length, b = m.shift(), _ = o._queueHooks(u, d), I = function() {
          o.dequeue(u, d);
        };
        b === "inprogress" && (b = m.shift(), y--), b && (d === "fx" && m.unshift("inprogress"), delete _.stop, b.call(u, I, _)), !y && _ && _.empty.fire();
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
        var m, y = 1, b = o.Deferred(), _ = this, I = this.length, P = function() {
          --y || b.resolveWith(_, [_]);
        };
        for (typeof u != "string" && (d = u, u = void 0), u = u || "fx"; I--; )
          m = o._data(_[I], u + "queueHooks"), m && m.empty && (y++, m.empty.add(P));
        return P(), b.promise(d);
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
    var JA = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, X = new RegExp("^(?:([+-])=|)(" + JA + ")([a-z%]*)$", "i"), V = ["Top", "Right", "Bottom", "Left"], k = function(u, d) {
      return u = d || u, o.css(u, "display") === "none" || !o.contains(u.ownerDocument, u);
    };
    function eA(u, d, m, y) {
      var b, _ = 1, I = 20, P = y ? function() {
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
      return m && (nA = +nA || +z || 0, b = m[1] ? nA + (m[1] + 1) * m[2] : +m[2], y && (y.unit = Y, y.start = nA, y.end = b)), b;
    }
    var lA = function(u, d, m, y, b, _, I) {
      var P = 0, z = u.length, Y = m == null;
      if (o.type(m) === "object") {
        b = !0;
        for (P in m)
          lA(u, d, P, m[P], !0, _, I);
      } else if (y !== void 0 && (b = !0, o.isFunction(y) || (I = !0), Y && (I ? (d.call(u, y), d = null) : (Y = d, d = function(nA, FA, LA) {
        return Y.call(o(nA), LA);
      })), d))
        for (; P < z; P++)
          d(
            u[P],
            m,
            I ? y : y.call(u[P], P, d(u[P], m))
          );
      return b ? u : (
        // Gets
        Y ? d.call(u) : z ? d(u[0], m) : _
      );
    }, TA = /^(?:checkbox|radio)$/i, jA = /<([\w:-]+)/, se = /^$|\/(?:java|ecma)script/i, xe = /^\s+/, fe = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|dialog|figcaption|figure|footer|header|hgroup|main|mark|meter|nav|output|picture|progress|section|summary|template|time|video";
    function he(u) {
      var d = fe.split("|"), m = u.createDocumentFragment();
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
    var Te = {
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
    Te.optgroup = Te.option, Te.tbody = Te.tfoot = Te.colgroup = Te.caption = Te.thead, Te.th = Te.td;
    function ce(u, d) {
      var m, y, b = 0, _ = typeof u.getElementsByTagName < "u" ? u.getElementsByTagName(d || "*") : typeof u.querySelectorAll < "u" ? u.querySelectorAll(d || "*") : void 0;
      if (!_)
        for (_ = [], m = u.childNodes || u; (y = m[b]) != null; b++)
          !d || o.nodeName(y, d) ? _.push(y) : o.merge(_, ce(y, d));
      return d === void 0 || d && o.nodeName(u, d) ? o.merge([u], _) : _;
    }
    function Dt(u, d) {
      for (var m, y = 0; (m = u[y]) != null; y++)
        o._data(
          m,
          "globalEval",
          !d || o._data(d[y], "globalEval")
        );
    }
    var Ft = /<|&#?\w+;/, Ot = /<tbody/i;
    function Ut(u) {
      TA.test(u.type) && (u.defaultChecked = u.checked);
    }
    function gt(u, d, m, y, b) {
      for (var _, I, P, z, Y, nA, FA, LA = u.length, UA = he(d), re = [], ZA = 0; ZA < LA; ZA++)
        if (I = u[ZA], I || I === 0)
          if (o.type(I) === "object")
            o.merge(re, I.nodeType ? [I] : I);
          else if (!Ft.test(I))
            re.push(d.createTextNode(I));
          else {
            for (z = z || UA.appendChild(d.createElement("div")), Y = (jA.exec(I) || ["", ""])[1].toLowerCase(), FA = Te[Y] || Te._default, z.innerHTML = FA[1] + o.htmlPrefilter(I) + FA[2], _ = FA[0]; _--; )
              z = z.lastChild;
            if (!p.leadingWhitespace && xe.test(I) && re.push(d.createTextNode(xe.exec(I)[0])), !p.tbody)
              for (I = Y === "table" && !Ot.test(I) ? z.firstChild : (
                // String was a bare <thead> or <tfoot>
                FA[1] === "<table>" && !Ot.test(I) ? z : 0
              ), _ = I && I.childNodes.length; _--; )
                o.nodeName(nA = I.childNodes[_], "tbody") && !nA.childNodes.length && I.removeChild(nA);
            for (o.merge(re, z.childNodes), z.textContent = ""; z.firstChild; )
              z.removeChild(z.firstChild);
            z = UA.lastChild;
          }
      for (z && UA.removeChild(z), p.appendChecked || o.grep(ce(re, "input"), Ut), ZA = 0; I = re[ZA++]; ) {
        if (y && o.inArray(I, y) > -1) {
          b && b.push(I);
          continue;
        }
        if (P = o.contains(I.ownerDocument, I), z = ce(UA.appendChild(I), "script"), P && Dt(z), m)
          for (_ = 0; I = z[_++]; )
            se.test(I.type || "") && m.push(I);
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
    function XA() {
      try {
        return i.activeElement;
      } catch {
      }
    }
    function ye(u, d, m, y, b, _) {
      var I, P;
      if (typeof d == "object") {
        typeof m != "string" && (y = y || m, m = void 0);
        for (P in d)
          ye(u, P, m, y, d[P], _);
        return u;
      }
      if (y == null && b == null ? (b = m, y = m = void 0) : b == null && (typeof m == "string" ? (b = y, y = void 0) : (b = y, y = m, m = void 0)), b === !1)
        b = MA;
      else if (!b)
        return u;
      return _ === 1 && (I = b, b = function(z) {
        return o().off(z), I.apply(this, arguments);
      }, b.guid = I.guid || (I.guid = o.guid++)), u.each(function() {
        o.event.add(this, d, b, y, m);
      });
    }
    o.event = {
      global: {},
      add: function(u, d, m, y, b) {
        var _, I, P, z, Y, nA, FA, LA, UA, re, ZA, oe = o._data(u);
        if (oe) {
          for (m.handler && (z = m, m = z.handler, b = z.selector), m.guid || (m.guid = o.guid++), (I = oe.events) || (I = oe.events = {}), (nA = oe.handle) || (nA = oe.handle = function(ft) {
            return typeof o < "u" && (!ft || o.event.triggered !== ft.type) ? o.event.dispatch.apply(nA.elem, arguments) : void 0;
          }, nA.elem = u), d = (d || "").match(gA) || [""], P = d.length; P--; )
            _ = Vr.exec(d[P]) || [], UA = ZA = _[1], re = (_[2] || "").split(".").sort(), UA && (Y = o.event.special[UA] || {}, UA = (b ? Y.delegateType : Y.bindType) || UA, Y = o.event.special[UA] || {}, FA = o.extend({
              type: UA,
              origType: ZA,
              data: y,
              handler: m,
              guid: m.guid,
              selector: b,
              needsContext: b && o.expr.match.needsContext.test(b),
              namespace: re.join(".")
            }, z), (LA = I[UA]) || (LA = I[UA] = [], LA.delegateCount = 0, (!Y.setup || Y.setup.call(u, y, re, nA) === !1) && (u.addEventListener ? u.addEventListener(UA, nA, !1) : u.attachEvent && u.attachEvent("on" + UA, nA))), Y.add && (Y.add.call(u, FA), FA.handler.guid || (FA.handler.guid = m.guid)), b ? LA.splice(LA.delegateCount++, 0, FA) : LA.push(FA), o.event.global[UA] = !0);
          u = null;
        }
      },
      // Detach an event or set of events from an element
      remove: function(u, d, m, y, b) {
        var _, I, P, z, Y, nA, FA, LA, UA, re, ZA, oe = o.hasData(u) && o._data(u);
        if (!(!oe || !(nA = oe.events))) {
          for (d = (d || "").match(gA) || [""], Y = d.length; Y--; ) {
            if (P = Vr.exec(d[Y]) || [], UA = ZA = P[1], re = (P[2] || "").split(".").sort(), !UA) {
              for (UA in nA)
                o.event.remove(u, UA + d[Y], m, y, !0);
              continue;
            }
            for (FA = o.event.special[UA] || {}, UA = (y ? FA.delegateType : FA.bindType) || UA, LA = nA[UA] || [], P = P[2] && new RegExp("(^|\\.)" + re.join("\\.(?:.*\\.|)") + "(\\.|$)"), z = _ = LA.length; _--; )
              I = LA[_], (b || ZA === I.origType) && (!m || m.guid === I.guid) && (!P || P.test(I.namespace)) && (!y || y === I.selector || y === "**" && I.selector) && (LA.splice(_, 1), I.selector && LA.delegateCount--, FA.remove && FA.remove.call(u, I));
            z && !LA.length && ((!FA.teardown || FA.teardown.call(u, re, oe.handle) === !1) && o.removeEvent(u, UA, oe.handle), delete nA[UA]);
          }
          o.isEmptyObject(nA) && (delete oe.handle, o._removeData(u, "events"));
        }
      },
      trigger: function(u, d, m, y) {
        var b, _, I, P, z, Y, nA, FA = [m || i], LA = B.call(u, "type") ? u.type : u, UA = B.call(u, "namespace") ? u.namespace.split(".") : [];
        if (I = Y = m = m || i, !(m.nodeType === 3 || m.nodeType === 8) && !Gr.test(LA + o.event.triggered) && (LA.indexOf(".") > -1 && (UA = LA.split("."), LA = UA.shift(), UA.sort()), _ = LA.indexOf(":") < 0 && "on" + LA, u = u[o.expando] ? u : new o.Event(LA, typeof u == "object" && u), u.isTrigger = y ? 2 : 3, u.namespace = UA.join("."), u.rnamespace = u.namespace ? new RegExp("(^|\\.)" + UA.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, u.result = void 0, u.target || (u.target = m), d = d == null ? [u] : o.makeArray(d, [u]), z = o.event.special[LA] || {}, !(!y && z.trigger && z.trigger.apply(m, d) === !1))) {
          if (!y && !z.noBubble && !o.isWindow(m)) {
            for (P = z.delegateType || LA, Gr.test(P + LA) || (I = I.parentNode); I; I = I.parentNode)
              FA.push(I), Y = I;
            Y === (m.ownerDocument || i) && FA.push(Y.defaultView || Y.parentWindow || e);
          }
          for (nA = 0; (I = FA[nA++]) && !u.isPropagationStopped(); )
            u.type = nA > 1 ? P : z.bindType || LA, b = (o._data(I, "events") || {})[u.type] && o._data(I, "handle"), b && b.apply(I, d), b = _ && I[_], b && b.apply && j(I) && (u.result = b.apply(I, d), u.result === !1 && u.preventDefault());
          if (u.type = LA, !y && !u.isDefaultPrevented() && (!z._default || z._default.apply(FA.pop(), d) === !1) && j(m) && _ && m[LA] && !o.isWindow(m)) {
            Y = m[_], Y && (m[_] = null), o.event.triggered = LA;
            try {
              m[LA]();
            } catch {
            }
            o.event.triggered = void 0, Y && (m[_] = Y);
          }
          return u.result;
        }
      },
      dispatch: function(u) {
        u = o.event.fix(u);
        var d, m, y, b, _, I = [], P = s.call(arguments), z = (o._data(this, "events") || {})[u.type] || [], Y = o.event.special[u.type] || {};
        if (P[0] = u, u.delegateTarget = this, !(Y.preDispatch && Y.preDispatch.call(this, u) === !1)) {
          for (I = o.event.handlers.call(this, u, z), d = 0; (b = I[d++]) && !u.isPropagationStopped(); )
            for (u.currentTarget = b.elem, m = 0; (_ = b.handlers[m++]) && !u.isImmediatePropagationStopped(); )
              (!u.rnamespace || u.rnamespace.test(_.namespace)) && (u.handleObj = _, u.data = _.data, y = ((o.event.special[_.origType] || {}).handle || _.handler).apply(b.elem, P), y !== void 0 && (u.result = y) === !1 && (u.preventDefault(), u.stopPropagation()));
          return Y.postDispatch && Y.postDispatch.call(this, u), u.result;
        }
      },
      handlers: function(u, d) {
        var m, y, b, _, I = [], P = d.delegateCount, z = u.target;
        if (P && z.nodeType && (u.type !== "click" || isNaN(u.button) || u.button < 1)) {
          for (; z != this; z = z.parentNode || this)
            if (z.nodeType === 1 && (z.disabled !== !0 || u.type !== "click")) {
              for (y = [], m = 0; m < P; m++)
                _ = d[m], b = _.selector + " ", y[b] === void 0 && (y[b] = _.needsContext ? o(b, this).index(z) > -1 : o.find(b, this, null, [z]).length), y[b] && y.push(_);
              y.length && I.push({ elem: z, handlers: y });
            }
        }
        return P < d.length && I.push({ elem: this, handlers: d.slice(P) }), I;
      },
      fix: function(u) {
        if (u[o.expando])
          return u;
        var d, m, y, b = u.type, _ = u, I = this.fixHooks[b];
        for (I || (this.fixHooks[b] = I = Qi.test(b) ? this.mouseHooks : dr.test(b) ? this.keyHooks : {}), y = I.props ? this.props.concat(I.props) : this.props, u = new o.Event(_), d = y.length; d--; )
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
          var m, y, b, _ = d.button, I = d.fromElement;
          return u.pageX == null && d.clientX != null && (y = u.target.ownerDocument || i, b = y.documentElement, m = y.body, u.pageX = d.clientX + (b && b.scrollLeft || m && m.scrollLeft || 0) - (b && b.clientLeft || m && m.clientLeft || 0), u.pageY = d.clientY + (b && b.scrollTop || m && m.scrollTop || 0) - (b && b.clientTop || m && m.clientTop || 0)), !u.relatedTarget && I && (u.relatedTarget = I === u.target ? d.toElement : I), !u.which && _ !== void 0 && (u.which = _ & 1 ? 1 : _ & 2 ? 3 : _ & 4 ? 2 : 0), u;
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
          var y, b = this, _ = m.relatedTarget, I = m.handleObj;
          return (!_ || _ !== b && !o.contains(b, _)) && (m.type = I.origType, y = I.handler.apply(this, arguments), m.type = d), y;
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
          var y = this.ownerDocument || this, b = o._data(y, d);
          b || y.addEventListener(u, m, !0), o._data(y, d, (b || 0) + 1);
        },
        teardown: function() {
          var y = this.ownerDocument || this, b = o._data(y, d) - 1;
          b ? o._data(y, d, b) : (y.removeEventListener(u, m, !0), o._removeData(y, d));
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
        var y, b;
        if (u && u.preventDefault && u.handleObj)
          return y = u.handleObj, o(u.delegateTarget).off(
            y.namespace ? y.origType + "." + y.namespace : y.origType,
            y.selector,
            y.handler
          ), this;
        if (typeof u == "object") {
          for (b in u)
            this.off(b, d, u[b]);
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
    var Ce = / jQuery\d+="(?:null|\d+)"/g, at = new RegExp("<(?:" + fe + ")[\\s/>]", "i"), bt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi, Un = /<script|<style|<link/i, Fi = /checked\s*(?:[^=]|=\s*.checked.)/i, bn = /^true\/(.*)/, Ui = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, Wr = he(i), ln = Wr.appendChild(i.createElement("div"));
    function bi(u, d) {
      return o.nodeName(u, "table") && o.nodeName(d.nodeType !== 11 ? d : d.firstChild, "tr") ? u.getElementsByTagName("tbody")[0] || u.appendChild(u.ownerDocument.createElement("tbody")) : u;
    }
    function Xr(u) {
      return u.type = (o.find.attr(u, "type") !== null) + "/" + u.type, u;
    }
    function pr(u) {
      var d = bn.exec(u.type);
      return d ? u.type = d[1] : u.removeAttribute("type"), u;
    }
    function $s(u, d) {
      if (!(d.nodeType !== 1 || !o.hasData(u))) {
        var m, y, b, _ = o._data(u), I = o._data(d, _), P = _.events;
        if (P) {
          delete I.handle, I.events = {};
          for (m in P)
            for (y = 0, b = P[m].length; y < b; y++)
              o.event.add(d, m, P[m][y]);
        }
        I.data && (I.data = o.extend({}, I.data));
      }
    }
    function co(u, d) {
      var m, y, b;
      if (d.nodeType === 1) {
        if (m = d.nodeName.toLowerCase(), !p.noCloneEvent && d[o.expando]) {
          b = o._data(d);
          for (y in b.events)
            o.removeEvent(d, y, b.handle);
          d.removeAttribute(o.expando);
        }
        m === "script" && d.text !== u.text ? (Xr(d).text = u.text, pr(d)) : m === "object" ? (d.parentNode && (d.outerHTML = u.outerHTML), p.html5Clone && u.innerHTML && !o.trim(d.innerHTML) && (d.innerHTML = u.innerHTML)) : m === "input" && TA.test(u.type) ? (d.defaultChecked = d.checked = u.checked, d.value !== u.value && (d.value = u.value)) : m === "option" ? d.defaultSelected = d.selected = u.defaultSelected : (m === "input" || m === "textarea") && (d.defaultValue = u.defaultValue);
      }
    }
    function gr(u, d, m, y) {
      d = l.apply([], d);
      var b, _, I, P, z, Y, nA = 0, FA = u.length, LA = FA - 1, UA = d[0], re = o.isFunction(UA);
      if (re || FA > 1 && typeof UA == "string" && !p.checkClone && Fi.test(UA))
        return u.each(function(ZA) {
          var oe = u.eq(ZA);
          re && (d[0] = UA.call(this, ZA, oe.html())), gr(oe, d, m, y);
        });
      if (FA && (Y = gt(d, u[0].ownerDocument, !1, u, y), b = Y.firstChild, Y.childNodes.length === 1 && (Y = b), b || y)) {
        for (P = o.map(ce(Y, "script"), Xr), I = P.length; nA < FA; nA++)
          _ = Y, nA !== LA && (_ = o.clone(_, !0, !0), I && o.merge(P, ce(_, "script"))), m.call(u[nA], _, nA);
        if (I)
          for (z = P[P.length - 1].ownerDocument, o.map(P, pr), nA = 0; nA < I; nA++)
            _ = P[nA], se.test(_.type || "") && !o._data(_, "globalEval") && o.contains(z, _) && (_.src ? o._evalUrl && o._evalUrl(_.src) : o.globalEval(
              (_.text || _.textContent || _.innerHTML || "").replace(Ui, "")
            ));
        Y = b = null;
      }
      return u;
    }
    function sa(u, d, m) {
      for (var y, b = d ? o.filter(d, u) : u, _ = 0; (y = b[_]) != null; _++)
        !m && y.nodeType === 1 && o.cleanData(ce(y)), y.parentNode && (m && o.contains(y.ownerDocument, y) && Dt(ce(y, "script")), y.parentNode.removeChild(y));
      return u;
    }
    o.extend({
      htmlPrefilter: function(u) {
        return u.replace(bt, "<$1></$2>");
      },
      clone: function(u, d, m) {
        var y, b, _, I, P, z = o.contains(u.ownerDocument, u);
        if (p.html5Clone || o.isXMLDoc(u) || !at.test("<" + u.nodeName + ">") ? _ = u.cloneNode(!0) : (ln.innerHTML = u.outerHTML, ln.removeChild(_ = ln.firstChild)), (!p.noCloneEvent || !p.noCloneChecked) && (u.nodeType === 1 || u.nodeType === 11) && !o.isXMLDoc(u))
          for (y = ce(_), P = ce(u), I = 0; (b = P[I]) != null; ++I)
            y[I] && co(b, y[I]);
        if (d)
          if (m)
            for (P = P || ce(u), y = y || ce(_), I = 0; (b = P[I]) != null; I++)
              $s(b, y[I]);
          else
            $s(u, _);
        return y = ce(_, "script"), y.length > 0 && Dt(y, !z && ce(u, "script")), y = P = b = null, _;
      },
      cleanData: function(u, d) {
        for (var m, y, b, _, I = 0, P = o.expando, z = o.cache, Y = p.attributes, nA = o.event.special; (m = u[I]) != null; I++)
          if ((d || j(m)) && (b = m[P], _ = b && z[b], _)) {
            if (_.events)
              for (y in _.events)
                nA[y] ? o.event.remove(m, y) : o.removeEvent(m, y, _.handle);
            z[b] && (delete z[b], !Y && typeof m.removeAttribute < "u" ? m.removeAttribute(P) : m[P] = void 0, n.push(b));
          }
      }
    }), o.fn.extend({
      // Keep domManip exposed until 3.0 (gh-2225)
      domManip: gr,
      detach: function(u) {
        return sa(this, u, !0);
      },
      remove: function(u) {
        return sa(this, u);
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
            var d = bi(this, u);
            d.appendChild(u);
          }
        });
      },
      prepend: function() {
        return gr(this, arguments, function(u) {
          if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
            var d = bi(this, u);
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
          for (u.nodeType === 1 && o.cleanData(ce(u, !1)); u.firstChild; )
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
          var m = this[0] || {}, y = 0, b = this.length;
          if (d === void 0)
            return m.nodeType === 1 ? m.innerHTML.replace(Ce, "") : void 0;
          if (typeof d == "string" && !Un.test(d) && (p.htmlSerialize || !at.test(d)) && (p.leadingWhitespace || !xe.test(d)) && !Te[(jA.exec(d) || ["", ""])[1].toLowerCase()]) {
            d = o.htmlPrefilter(d);
            try {
              for (; y < b; y++)
                m = this[y] || {}, m.nodeType === 1 && (o.cleanData(ce(m, !1)), m.innerHTML = d);
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
          o.inArray(this, u) < 0 && (o.cleanData(ce(this)), m && m.replaceChild(d, this));
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
        for (var y, b = 0, _ = [], I = o(m), P = I.length - 1; b <= P; b++)
          y = b === P ? this : this.clone(!0), o(I[b])[d](y), f.apply(_, y.get());
        return this.pushStack(_);
      };
    });
    var Ei, Gs = {
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
      return m || (m = Vs(u, d), (m === "none" || !m) && (Ei = (Ei || o("<iframe frameborder='0' width='0' height='0'/>")).appendTo(d.documentElement), d = (Ei[0].contentWindow || Ei[0].contentDocument).document, d.write(), d.close(), m = Vs(u, d), Ei.detach()), Gs[u] = m), m;
    }
    var Ws = /^margin/, la = new RegExp("^(" + JA + ")(?!px)[a-z%]+$", "i"), fo = function(u, d, m, y) {
      var b, _, I = {};
      for (_ in d)
        I[_] = u.style[_], u.style[_] = d[_];
      b = m.apply(u, y || []);
      for (_ in d)
        u.style[_] = I[_];
      return b;
    }, Xs = i.documentElement;
    (function() {
      var u, d, m, y, b, _, I = i.createElement("div"), P = i.createElement("div");
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
          return u == null && z(), b;
        },
        reliableMarginLeft: function() {
          return u == null && z(), _;
        }
      });
      function z() {
        var Y, nA, FA = i.documentElement;
        FA.appendChild(I), P.style.cssText = // Support: Android 2.3
        // Vendor-prefix box-sizing
        "-webkit-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%", u = m = _ = !1, d = b = !0, e.getComputedStyle && (nA = e.getComputedStyle(P), u = (nA || {}).top !== "1%", _ = (nA || {}).marginLeft === "2px", m = (nA || { width: "4px" }).width === "4px", P.style.marginRight = "50%", d = (nA || { marginRight: "4px" }).marginRight === "4px", Y = P.appendChild(i.createElement("div")), Y.style.cssText = P.style.cssText = // Support: Android 2.3
        // Vendor-prefix box-sizing
        "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", Y.style.marginRight = Y.style.width = "0", P.style.width = "1px", b = !parseFloat((e.getComputedStyle(Y) || {}).marginRight), P.removeChild(Y)), P.style.display = "none", y = P.getClientRects().length === 0, y && (P.style.display = "", P.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", P.childNodes[0].style.borderCollapse = "separate", Y = P.getElementsByTagName("td"), Y[0].style.cssText = "margin:0;border:0;padding:0;display:none", y = Y[0].offsetHeight === 0, y && (Y[0].style.display = "", Y[1].style.display = "none", y = Y[0].offsetHeight === 0)), FA.removeChild(I);
      }
    })();
    var qn, zn, kc = /^(top|right|bottom|left)$/;
    e.getComputedStyle ? (qn = function(u) {
      var d = u.ownerDocument.defaultView;
      return (!d || !d.opener) && (d = e), d.getComputedStyle(u);
    }, zn = function(u, d, m) {
      var y, b, _, I, P = u.style;
      return m = m || qn(u), I = m ? m.getPropertyValue(d) || m[d] : void 0, (I === "" || I === void 0) && !o.contains(u.ownerDocument, u) && (I = o.style(u, d)), m && !p.pixelMarginRight() && la.test(I) && Ws.test(d) && (y = P.width, b = P.minWidth, _ = P.maxWidth, P.minWidth = P.maxWidth = P.width = I, I = m.width, P.width = y, P.minWidth = b, P.maxWidth = _), I === void 0 ? I : I + "";
    }) : Xs.currentStyle && (qn = function(u) {
      return u.currentStyle;
    }, zn = function(u, d, m) {
      var y, b, _, I, P = u.style;
      return m = m || qn(u), I = m ? m[d] : void 0, I == null && P && P[d] && (I = P[d]), la.test(I) && !kc.test(d) && (y = P.left, b = u.runtimeStyle, _ = b && b.left, _ && (b.left = u.currentStyle.left), P.left = d === "fontSize" ? "1em" : I, I = P.pixelLeft + "px", P.left = y, _ && (b.left = _)), I === void 0 ? I : I + "" || "auto";
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
    var po = /alpha\([^)]*\)/i, $c = /opacity\s*=\s*([^)]*)/i, Gc = /^(none|table(?!-c[ea]).+)/, ca = new RegExp("^(" + JA + ")(.*)$", "i"), Vc = { position: "absolute", visibility: "hidden", display: "block" }, _i = {
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
    function go(u, d) {
      for (var m, y, b, _ = [], I = 0, P = u.length; I < P; I++)
        y = u[I], y.style && (_[I] = o._data(y, "olddisplay"), m = y.style.display, d ? (!_[I] && m === "none" && (y.style.display = ""), y.style.display === "" && k(y) && (_[I] = o._data(y, "olddisplay", ua(y.nodeName)))) : (b = k(y), (m && m !== "none" || !b) && o._data(
          y,
          "olddisplay",
          b ? m : o.css(y, "display")
        )));
      for (I = 0; I < P; I++)
        y = u[I], y.style && (!d || y.style.display === "none" || y.style.display === "") && (y.style.display = d ? _[I] || "" : "none");
      return u;
    }
    function Bo(u, d, m) {
      var y = ca.exec(d);
      return y ? (
        // Guard against undefined "subtract", e.g., when used as in cssHooks
        Math.max(0, y[1] - (m || 0)) + (y[2] || "px")
      ) : d;
    }
    function wo(u, d, m, y, b) {
      for (var _ = m === (y ? "border" : "content") ? (
        // If we already have the right measurement, avoid augmentation
        4
      ) : (
        // Otherwise initialize for horizontal or vertical properties
        d === "width" ? 1 : 0
      ), I = 0; _ < 4; _ += 2)
        m === "margin" && (I += o.css(u, m + V[_], !0, b)), y ? (m === "content" && (I -= o.css(u, "padding" + V[_], !0, b)), m !== "margin" && (I -= o.css(u, "border" + V[_] + "Width", !0, b))) : (I += o.css(u, "padding" + V[_], !0, b), m !== "padding" && (I += o.css(u, "border" + V[_] + "Width", !0, b)));
      return I;
    }
    function js(u, d, m) {
      var y = !0, b = d === "width" ? u.offsetWidth : u.offsetHeight, _ = qn(u), I = p.boxSizing && o.css(u, "boxSizing", !1, _) === "border-box";
      if (b <= 0 || b == null) {
        if (b = zn(u, d, _), (b < 0 || b == null) && (b = u.style[d]), la.test(b))
          return b;
        y = I && (p.boxSizingReliable() || b === u.style[d]), b = parseFloat(b) || 0;
      }
      return b + wo(
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
          var b, _, I, P = o.camelCase(d), z = u.style;
          if (d = o.cssProps[P] || (o.cssProps[P] = Js(P) || P), I = o.cssHooks[d] || o.cssHooks[P], m !== void 0) {
            if (_ = typeof m, _ === "string" && (b = X.exec(m)) && b[1] && (m = eA(u, d, b), _ = "number"), m == null || m !== m)
              return;
            if (_ === "number" && (m += b && b[3] || (o.cssNumber[P] ? "" : "px")), !p.clearCloneStyle && m === "" && d.indexOf("background") === 0 && (z[d] = "inherit"), !I || !("set" in I) || (m = I.set(u, m, y)) !== void 0)
              try {
                z[d] = m;
              } catch {
              }
          } else
            return I && "get" in I && (b = I.get(u, !1, y)) !== void 0 ? b : z[d];
        }
      },
      css: function(u, d, m, y) {
        var b, _, I, P = o.camelCase(d);
        return d = o.cssProps[P] || (o.cssProps[P] = Js(P) || P), I = o.cssHooks[d] || o.cssHooks[P], I && "get" in I && (_ = I.get(u, !0, m)), _ === void 0 && (_ = zn(u, d, y)), _ === "normal" && d in _i && (_ = _i[d]), m === "" || m ? (b = parseFloat(_), m === !0 || isFinite(b) ? b || 0 : _) : _;
      }
    }), o.each(["height", "width"], function(u, d) {
      o.cssHooks[d] = {
        get: function(m, y, b) {
          if (y)
            return Gc.test(o.css(m, "display")) && m.offsetWidth === 0 ? fo(m, Vc, function() {
              return js(m, d, b);
            }) : js(m, d, b);
        },
        set: function(m, y, b) {
          var _ = b && qn(m);
          return Bo(
            m,
            y,
            b ? wo(
              m,
              d,
              b,
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
        var m = u.style, y = u.currentStyle, b = o.isNumeric(d) ? "alpha(opacity=" + d * 100 + ")" : "", _ = y && y.filter || m.filter || "";
        m.zoom = 1, !((d >= 1 || d === "") && o.trim(_.replace(po, "")) === "" && m.removeAttribute && (m.removeAttribute("filter"), d === "" || y && !y.filter)) && (m.filter = po.test(_) ? _.replace(po, b) : _ + " " + b);
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
          for (var y = 0, b = {}, _ = typeof m == "string" ? m.split(" ") : [m]; y < 4; y++)
            b[u + V[y] + d] = _[y] || _[y - 2] || _[0];
          return b;
        }
      }, Ws.test(u) || (o.cssHooks[u + d].set = Bo);
    }), o.fn.extend({
      css: function(u, d) {
        return lA(this, function(m, y, b) {
          var _, I, P = {}, z = 0;
          if (o.isArray(y)) {
            for (_ = qn(m), I = y.length; z < I; z++)
              P[y[z]] = o.css(m, y[z], !1, _);
            return P;
          }
          return b !== void 0 ? o.style(m, y, b) : o.css(m, y);
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
    function Et(u, d, m, y, b) {
      return new Et.prototype.init(u, d, m, y, b);
    }
    o.Tween = Et, Et.prototype = {
      constructor: Et,
      init: function(u, d, m, y, b, _) {
        this.elem = u, this.prop = m, this.easing = b || o.easing._default, this.options = d, this.start = this.now = this.cur(), this.end = y, this.unit = _ || (o.cssNumber[m] ? "" : "px");
      },
      cur: function() {
        var u = Et.propHooks[this.prop];
        return u && u.get ? u.get(this) : Et.propHooks._default.get(this);
      },
      run: function(u) {
        var d, m = Et.propHooks[this.prop];
        return this.options.duration ? this.pos = d = o.easing[this.easing](
          u,
          this.options.duration * u,
          0,
          1,
          this.options.duration
        ) : this.pos = d = u, this.now = (this.end - this.start) * d + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), m && m.set ? m.set(this) : Et.propHooks._default.set(this), this;
      }
    }, Et.prototype.init.prototype = Et.prototype, Et.propHooks = {
      _default: {
        get: function(u) {
          var d;
          return u.elem.nodeType !== 1 || u.elem[u.prop] != null && u.elem.style[u.prop] == null ? u.elem[u.prop] : (d = o.css(u.elem, u.prop, ""), !d || d === "auto" ? 0 : d);
        },
        set: function(u) {
          o.fx.step[u.prop] ? o.fx.step[u.prop](u) : u.elem.nodeType === 1 && (u.elem.style[o.cssProps[u.prop]] != null || o.cssHooks[u.prop]) ? o.style(u.elem, u.prop, u.now + u.unit) : u.elem[u.prop] = u.now;
        }
      }
    }, Et.propHooks.scrollTop = Et.propHooks.scrollLeft = {
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
    }, o.fx = Et.prototype.init, o.fx.step = {};
    var qr, fa, Ys = /^(?:toggle|show|hide)$/, Zs = /queueHooks$/;
    function mo() {
      return e.setTimeout(function() {
        qr = void 0;
      }), qr = o.now();
    }
    function zr(u, d) {
      var m, y = { height: u }, b = 0;
      for (d = d ? 1 : 0; b < 4; b += 2 - d)
        m = V[b], y["margin" + m] = y["padding" + m] = u;
      return d && (y.opacity = y.width = u), y;
    }
    function Au(u, d, m) {
      for (var y, b = (Gt.tweeners[d] || []).concat(Gt.tweeners["*"]), _ = 0, I = b.length; _ < I; _++)
        if (y = b[_].call(m, d, u))
          return y;
    }
    function eu(u, d, m) {
      var y, b, _, I, P, z, Y, nA, FA = this, LA = {}, UA = u.style, re = u.nodeType && k(u), ZA = o._data(u, "fxshow");
      m.queue || (P = o._queueHooks(u, "fx"), P.unqueued == null && (P.unqueued = 0, z = P.empty.fire, P.empty.fire = function() {
        P.unqueued || z();
      }), P.unqueued++, FA.always(function() {
        FA.always(function() {
          P.unqueued--, o.queue(u, "fx").length || P.empty.fire();
        });
      })), u.nodeType === 1 && ("height" in d || "width" in d) && (m.overflow = [UA.overflow, UA.overflowX, UA.overflowY], Y = o.css(u, "display"), nA = Y === "none" ? o._data(u, "olddisplay") || ua(u.nodeName) : Y, nA === "inline" && o.css(u, "float") === "none" && (!p.inlineBlockNeedsLayout || ua(u.nodeName) === "inline" ? UA.display = "inline-block" : UA.zoom = 1)), m.overflow && (UA.overflow = "hidden", p.shrinkWrapBlocks() || FA.always(function() {
        UA.overflow = m.overflow[0], UA.overflowX = m.overflow[1], UA.overflowY = m.overflow[2];
      }));
      for (y in d)
        if (b = d[y], Ys.exec(b)) {
          if (delete d[y], _ = _ || b === "toggle", b === (re ? "hide" : "show"))
            if (b === "show" && ZA && ZA[y] !== void 0)
              re = !0;
            else
              continue;
          LA[y] = ZA && ZA[y] || o.style(u, y);
        } else
          Y = void 0;
      if (o.isEmptyObject(LA))
        (Y === "none" ? ua(u.nodeName) : Y) === "inline" && (UA.display = Y);
      else {
        ZA ? "hidden" in ZA && (re = ZA.hidden) : ZA = o._data(u, "fxshow", {}), _ && (ZA.hidden = !re), re ? o(u).show() : FA.done(function() {
          o(u).hide();
        }), FA.done(function() {
          var oe;
          o._removeData(u, "fxshow");
          for (oe in LA)
            o.style(u, oe, LA[oe]);
        });
        for (y in LA)
          I = Au(re ? ZA[y] : 0, y, FA), y in ZA || (ZA[y] = I.start, re && (I.end = I.start, I.start = y === "width" || y === "height" ? 1 : 0));
      }
    }
    function ha(u, d) {
      var m, y, b, _, I;
      for (m in u)
        if (y = o.camelCase(m), b = d[y], _ = u[m], o.isArray(_) && (b = _[1], _ = u[m] = _[0]), m !== y && (u[y] = _, delete u[m]), I = o.cssHooks[y], I && "expand" in I) {
          _ = I.expand(_), delete u[y];
          for (m in _)
            m in u || (u[m] = _[m], d[m] = b);
        } else
          d[y] = b;
    }
    function Gt(u, d, m) {
      var y, b, _ = 0, I = Gt.prefilters.length, P = o.Deferred().always(function() {
        delete z.elem;
      }), z = function() {
        if (b)
          return !1;
        for (var FA = qr || mo(), LA = Math.max(0, Y.startTime + Y.duration - FA), UA = LA / Y.duration || 0, re = 1 - UA, ZA = 0, oe = Y.tweens.length; ZA < oe; ZA++)
          Y.tweens[ZA].run(re);
        return P.notifyWith(u, [Y, re, LA]), re < 1 && oe ? LA : (P.resolveWith(u, [Y]), !1);
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
        createTween: function(FA, LA) {
          var UA = o.Tween(
            u,
            Y.opts,
            FA,
            LA,
            Y.opts.specialEasing[FA] || Y.opts.easing
          );
          return Y.tweens.push(UA), UA;
        },
        stop: function(FA) {
          var LA = 0, UA = FA ? Y.tweens.length : 0;
          if (b)
            return this;
          for (b = !0; LA < UA; LA++)
            Y.tweens[LA].run(1);
          return FA ? (P.notifyWith(u, [Y, 1, 0]), P.resolveWith(u, [Y, FA])) : P.rejectWith(u, [Y, FA]), this;
        }
      }), nA = Y.props;
      for (ha(nA, Y.opts.specialEasing); _ < I; _++)
        if (y = Gt.prefilters[_].call(Y, u, nA, Y.opts), y)
          return o.isFunction(y.stop) && (o._queueHooks(Y.elem, Y.opts.queue).stop = o.proxy(y.stop, y)), y;
      return o.map(nA, Au, Y), o.isFunction(Y.opts.start) && Y.opts.start.call(u, Y), o.fx.timer(
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
        for (var m, y = 0, b = u.length; y < b; y++)
          m = u[y], Gt.tweeners[m] = Gt.tweeners[m] || [], Gt.tweeners[m].unshift(d);
      },
      prefilters: [eu],
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
        var b = o.isEmptyObject(u), _ = o.speed(d, m, y), I = function() {
          var P = Gt(this, o.extend({}, u), _);
          (b || o._data(this, "finish")) && P.stop(!0);
        };
        return I.finish = I, b || _.queue === !1 ? this.each(I) : this.queue(_.queue, I);
      },
      stop: function(u, d, m) {
        var y = function(b) {
          var _ = b.stop;
          delete b.stop, _(m);
        };
        return typeof u != "string" && (m = d, d = u, u = void 0), d && u !== !1 && this.queue(u || "fx", []), this.each(function() {
          var b = !0, _ = u != null && u + "queueHooks", I = o.timers, P = o._data(this);
          if (_)
            P[_] && P[_].stop && y(P[_]);
          else
            for (_ in P)
              P[_] && P[_].stop && Zs.test(_) && y(P[_]);
          for (_ = I.length; _--; )
            I[_].elem === this && (u == null || I[_].queue === u) && (I[_].anim.stop(m), b = !1, I.splice(_, 1));
          (b || !m) && o.dequeue(this, u);
        });
      },
      finish: function(u) {
        return u !== !1 && (u = u || "fx"), this.each(function() {
          var d, m = o._data(this), y = m[u + "queue"], b = m[u + "queueHooks"], _ = o.timers, I = y ? y.length : 0;
          for (m.finish = !0, o.queue(this, u, []), b && b.stop && b.stop.call(this, !0), d = _.length; d--; )
            _[d].elem === this && _[d].queue === u && (_[d].anim.stop(!0), _.splice(d, 1));
          for (d = 0; d < I; d++)
            y[d] && y[d].finish && y[d].finish.call(this);
          delete m.finish;
        });
      }
    }), o.each(["toggle", "show", "hide"], function(u, d) {
      var m = o.fn[d];
      o.fn[d] = function(y, b, _) {
        return y == null || typeof y == "boolean" ? m.apply(this, arguments) : this.animate(zr(d, !0), y, b, _);
      };
    }), o.each({
      slideDown: zr("show"),
      slideUp: zr("hide"),
      slideToggle: zr("toggle"),
      fadeIn: { opacity: "show" },
      fadeOut: { opacity: "hide" },
      fadeToggle: { opacity: "toggle" }
    }, function(u, d) {
      o.fn[u] = function(m, y, b) {
        return this.animate(d, m, y, b);
      };
    }), o.timers = [], o.fx.tick = function() {
      var u, d = o.timers, m = 0;
      for (qr = o.now(); m < d.length; m++)
        u = d[m], !u() && d[m] === u && d.splice(m--, 1);
      d.length || o.fx.stop(), qr = void 0;
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
        var b = e.setTimeout(m, u);
        y.stop = function() {
          e.clearTimeout(b);
        };
      });
    }, function() {
      var u, d = i.createElement("input"), m = i.createElement("div"), y = i.createElement("select"), b = y.appendChild(i.createElement("option"));
      m = i.createElement("div"), m.setAttribute("className", "t"), m.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", u = m.getElementsByTagName("a")[0], d.setAttribute("type", "checkbox"), m.appendChild(d), u = m.getElementsByTagName("a")[0], u.style.cssText = "top:1px", p.getSetAttribute = m.className !== "t", p.style = /top/.test(u.getAttribute("style")), p.hrefNormalized = u.getAttribute("href") === "/a", p.checkOn = !!d.value, p.optSelected = b.selected, p.enctype = !!i.createElement("form").enctype, y.disabled = !0, p.optDisabled = !b.disabled, d = i.createElement("input"), d.setAttribute("value", ""), p.input = d.getAttribute("value") === "", d.value = "t", d.setAttribute("type", "radio"), p.radioValue = d.value === "t";
    }();
    var Wc = /\r/g, tu = /[\x20\t\r\n\f]+/g;
    o.fn.extend({
      val: function(u) {
        var d, m, y, b = this[0];
        return arguments.length ? (y = o.isFunction(u), this.each(function(_) {
          var I;
          this.nodeType === 1 && (y ? I = u.call(this, _, o(this).val()) : I = u, I == null ? I = "" : typeof I == "number" ? I += "" : o.isArray(I) && (I = o.map(I, function(P) {
            return P == null ? "" : P + "";
          })), d = o.valHooks[this.type] || o.valHooks[this.nodeName.toLowerCase()], (!d || !("set" in d) || d.set(this, I, "value") === void 0) && (this.value = I));
        })) : b ? (d = o.valHooks[b.type] || o.valHooks[b.nodeName.toLowerCase()], d && "get" in d && (m = d.get(b, "value")) !== void 0 ? m : (m = b.value, typeof m == "string" ? (
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
            o.trim(o.text(u)).replace(tu, " ");
          }
        },
        select: {
          get: function(u) {
            for (var d, m, y = u.options, b = u.selectedIndex, _ = u.type === "select-one" || b < 0, I = _ ? null : [], P = _ ? b + 1 : y.length, z = b < 0 ? P : _ ? b : 0; z < P; z++)
              if (m = y[z], (m.selected || z === b) && // Don't return options that are disabled or in a disabled optgroup
              (p.optDisabled ? !m.disabled : m.getAttribute("disabled") === null) && (!m.parentNode.disabled || !o.nodeName(m.parentNode, "optgroup"))) {
                if (d = o(m).val(), _)
                  return d;
                I.push(d);
              }
            return I;
          },
          set: function(u, d) {
            for (var m, y, b = u.options, _ = o.makeArray(d), I = b.length; I--; )
              if (y = b[I], o.inArray(o.valHooks.option.get(y), _) > -1)
                try {
                  y.selected = m = !0;
                } catch {
                  y.scrollHeight;
                }
              else
                y.selected = !1;
            return m || (u.selectedIndex = -1), b;
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
    var Br, da, En = o.expr.attrHandle, pa = /^(?:checked|selected)$/i, _n = p.getSetAttribute, Jr = p.input;
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
        var y, b, _ = u.nodeType;
        if (!(_ === 3 || _ === 8 || _ === 2)) {
          if (typeof u.getAttribute > "u")
            return o.prop(u, d, m);
          if ((_ !== 1 || !o.isXMLDoc(u)) && (d = d.toLowerCase(), b = o.attrHooks[d] || (o.expr.match.bool.test(d) ? da : Br)), m !== void 0) {
            if (m === null) {
              o.removeAttr(u, d);
              return;
            }
            return b && "set" in b && (y = b.set(u, m, d)) !== void 0 ? y : (u.setAttribute(d, m + ""), m);
          }
          return b && "get" in b && (y = b.get(u, d)) !== null ? y : (y = o.find.attr(u, d), y ?? void 0);
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
        var m, y, b = 0, _ = d && d.match(gA);
        if (_ && u.nodeType === 1)
          for (; m = _[b++]; )
            y = o.propFix[m] || m, o.expr.match.bool.test(m) ? Jr && _n || !pa.test(m) ? u[y] = !1 : u[o.camelCase("default-" + m)] = u[y] = !1 : o.attr(u, m, ""), u.removeAttribute(_n ? m : y);
      }
    }), da = {
      set: function(u, d, m) {
        return d === !1 ? o.removeAttr(u, m) : Jr && _n || !pa.test(m) ? u.setAttribute(!_n && o.propFix[m] || m, m) : u[o.camelCase("default-" + m)] = u[m] = !0, m;
      }
    }, o.each(o.expr.match.bool.source.match(/\w+/g), function(u, d) {
      var m = En[d] || o.find.attr;
      Jr && _n || !pa.test(d) ? En[d] = function(y, b, _) {
        var I, P;
        return _ || (P = En[b], En[b] = I, I = m(y, b, _) != null ? b.toLowerCase() : null, En[b] = P), I;
      } : En[d] = function(y, b, _) {
        if (!_)
          return y[o.camelCase("default-" + b)] ? b.toLowerCase() : null;
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
    }, En.id = En.name = En.coords = function(u, d, m) {
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
    var jr = /^(?:input|select|textarea|button|object)$/i, nu = /^(?:a|area)$/i;
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
        var y, b, _ = u.nodeType;
        if (!(_ === 3 || _ === 8 || _ === 2))
          return (_ !== 1 || !o.isXMLDoc(u)) && (d = o.propFix[d] || d, b = o.propHooks[d]), m !== void 0 ? b && "set" in b && (y = b.set(u, m, d)) !== void 0 ? y : u[d] = m : b && "get" in b && (y = b.get(u, d)) !== null ? y : u[d];
      },
      propHooks: {
        tabIndex: {
          get: function(u) {
            var d = o.find.attr(u, "tabindex");
            return d ? parseInt(d, 10) : jr.test(u.nodeName) || nu.test(u.nodeName) && u.href ? 0 : -1;
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
    function wr(u) {
      return o.attr(u, "class") || "";
    }
    o.fn.extend({
      addClass: function(u) {
        var d, m, y, b, _, I, P, z = 0;
        if (o.isFunction(u))
          return this.each(function(Y) {
            o(this).addClass(u.call(this, Y, wr(this)));
          });
        if (typeof u == "string" && u) {
          for (d = u.match(gA) || []; m = this[z++]; )
            if (b = wr(m), y = m.nodeType === 1 && (" " + b + " ").replace(ga, " "), y) {
              for (I = 0; _ = d[I++]; )
                y.indexOf(" " + _ + " ") < 0 && (y += _ + " ");
              P = o.trim(y), b !== P && o.attr(m, "class", P);
            }
        }
        return this;
      },
      removeClass: function(u) {
        var d, m, y, b, _, I, P, z = 0;
        if (o.isFunction(u))
          return this.each(function(Y) {
            o(this).removeClass(u.call(this, Y, wr(this)));
          });
        if (!arguments.length)
          return this.attr("class", "");
        if (typeof u == "string" && u) {
          for (d = u.match(gA) || []; m = this[z++]; )
            if (b = wr(m), y = m.nodeType === 1 && (" " + b + " ").replace(ga, " "), y) {
              for (I = 0; _ = d[I++]; )
                for (; y.indexOf(" " + _ + " ") > -1; )
                  y = y.replace(" " + _ + " ", " ");
              P = o.trim(y), b !== P && o.attr(m, "class", P);
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
          var y, b, _, I;
          if (m === "string")
            for (b = 0, _ = o(this), I = u.match(gA) || []; y = I[b++]; )
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
          if (m.nodeType === 1 && (" " + wr(m) + " ").replace(ga, " ").indexOf(d) > -1)
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
      return y && !o.trim(y.replace(iu, function(b, _, I, P) {
        return d && _ && (m = 0), m === 0 ? b : (d = I || _, m += !P - !I, "");
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
    var Xc = /#.*$/, au = /([?&])_=[^&]*/, qc = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, ou = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, zc = /^(?:GET|HEAD)$/, Jc = /^\/\//, su = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/, uu = {}, xi = {}, lu = "*/".concat("*"), vo = ru.href, Yr = su.exec(vo.toLowerCase()) || [];
    function cu(u) {
      return function(d, m) {
        typeof d != "string" && (m = d, d = "*");
        var y, b = 0, _ = d.toLowerCase().match(gA) || [];
        if (o.isFunction(m))
          for (; y = _[b++]; )
            y.charAt(0) === "+" ? (y = y.slice(1) || "*", (u[y] = u[y] || []).unshift(m)) : (u[y] = u[y] || []).push(m);
      };
    }
    function fu(u, d, m, y) {
      var b = {}, _ = u === xi;
      function I(P) {
        var z;
        return b[P] = !0, o.each(u[P] || [], function(Y, nA) {
          var FA = nA(d, m, y);
          if (typeof FA == "string" && !_ && !b[FA])
            return d.dataTypes.unshift(FA), I(FA), !1;
          if (_)
            return !(z = FA);
        }), z;
      }
      return I(d.dataTypes[0]) || !b["*"] && I("*");
    }
    function Me(u, d) {
      var m, y, b = o.ajaxSettings.flatOptions || {};
      for (y in d)
        d[y] !== void 0 && ((b[y] ? u : m || (m = {}))[y] = d[y]);
      return m && o.extend(!0, u, m), u;
    }
    function Pe(u, d, m) {
      for (var y, b, _, I, P = u.contents, z = u.dataTypes; z[0] === "*"; )
        z.shift(), b === void 0 && (b = u.mimeType || d.getResponseHeader("Content-Type"));
      if (b) {
        for (I in P)
          if (P[I] && P[I].test(b)) {
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
      var b, _, I, P, z, Y = {}, nA = u.dataTypes.slice();
      if (nA[1])
        for (I in u.converters)
          Y[I.toLowerCase()] = u.converters[I];
      for (_ = nA.shift(); _; )
        if (u.responseFields[_] && (m[u.responseFields[_]] = d), !z && y && u.dataFilter && (d = u.dataFilter(d, u.dataType)), z = _, _ = nA.shift(), _) {
          if (_ === "*")
            _ = z;
          else if (z !== "*" && z !== _) {
            if (I = Y[z + " " + _] || Y["* " + _], !I) {
              for (b in Y)
                if (P = b.split(" "), P[1] === _ && (I = Y[z + " " + P[0]] || Y["* " + P[0]], I)) {
                  I === !0 ? I = Y[b] : Y[b] !== !0 && (_ = P[0], nA.unshift(P[1]));
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
        isLocal: ou.test(Yr[1]),
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
          Me(Me(u, o.ajaxSettings), d)
        ) : (
          // Extending ajaxSettings
          Me(o.ajaxSettings, u)
        );
      },
      ajaxPrefilter: cu(uu),
      ajaxTransport: cu(xi),
      // Main method
      ajax: function(u, d) {
        typeof u == "object" && (d = u, u = void 0), d = d || {};
        var m, y, b, _, I, P, z, Y, nA = o.ajaxSetup({}, d), FA = nA.context || nA, LA = nA.context && (FA.nodeType || FA.jquery) ? o(FA) : o.event, UA = o.Deferred(), re = o.Callbacks("once memory"), ZA = nA.statusCode || {}, oe = {}, ft = {}, qe = 0, Jn = "canceled", kA = {
          readyState: 0,
          // Builds headers hashtable if needed
          getResponseHeader: function(ue) {
            var We;
            if (qe === 2) {
              if (!Y)
                for (Y = {}; We = qc.exec(_); )
                  Y[We[1].toLowerCase()] = We[2];
              We = Y[ue.toLowerCase()];
            }
            return We ?? null;
          },
          // Raw string
          getAllResponseHeaders: function() {
            return qe === 2 ? _ : null;
          },
          // Caches the header
          setRequestHeader: function(ue, We) {
            var xn = ue.toLowerCase();
            return qe || (ue = ft[xn] = ft[xn] || ue, oe[ue] = We), this;
          },
          // Overrides response content-type header
          overrideMimeType: function(ue) {
            return qe || (nA.mimeType = ue), this;
          },
          // Status-dependent callbacks
          statusCode: function(ue) {
            var We;
            if (ue)
              if (qe < 2)
                for (We in ue)
                  ZA[We] = [ZA[We], ue[We]];
              else
                kA.always(ue[kA.status]);
            return this;
          },
          // Cancel the request
          abort: function(ue) {
            var We = ue || Jn;
            return z && z.abort(We), st(0, We), this;
          }
        };
        if (UA.promise(kA).complete = re.add, kA.success = kA.done, kA.error = kA.fail, nA.url = ((u || nA.url || vo) + "").replace(Xc, "").replace(Jc, Yr[1] + "//"), nA.type = d.method || d.type || nA.method || nA.type, nA.dataTypes = o.trim(nA.dataType || "*").toLowerCase().match(gA) || [""], nA.crossDomain == null && (m = su.exec(nA.url.toLowerCase()), nA.crossDomain = !!(m && (m[1] !== Yr[1] || m[2] !== Yr[2] || (m[3] || (m[1] === "http:" ? "80" : "443")) !== (Yr[3] || (Yr[1] === "http:" ? "80" : "443"))))), nA.data && nA.processData && typeof nA.data != "string" && (nA.data = o.param(nA.data, nA.traditional)), fu(uu, nA, d, kA), qe === 2)
          return kA;
        P = o.event && nA.global, P && o.active++ === 0 && o.event.trigger("ajaxStart"), nA.type = nA.type.toUpperCase(), nA.hasContent = !zc.test(nA.type), b = nA.url, nA.hasContent || (nA.data && (b = nA.url += (wa.test(b) ? "&" : "?") + nA.data, delete nA.data), nA.cache === !1 && (nA.url = au.test(b) ? (
          // If there is already a '_' parameter, set its value
          b.replace(au, "$1_=" + Ba++)
        ) : (
          // Otherwise add one to the end
          b + (wa.test(b) ? "&" : "?") + "_=" + Ba++
        ))), nA.ifModified && (o.lastModified[b] && kA.setRequestHeader("If-Modified-Since", o.lastModified[b]), o.etag[b] && kA.setRequestHeader("If-None-Match", o.etag[b])), (nA.data && nA.hasContent && nA.contentType !== !1 || d.contentType) && kA.setRequestHeader("Content-Type", nA.contentType), kA.setRequestHeader(
          "Accept",
          nA.dataTypes[0] && nA.accepts[nA.dataTypes[0]] ? nA.accepts[nA.dataTypes[0]] + (nA.dataTypes[0] !== "*" ? ", " + lu + "; q=0.01" : "") : nA.accepts["*"]
        );
        for (y in nA.headers)
          kA.setRequestHeader(y, nA.headers[y]);
        if (nA.beforeSend && (nA.beforeSend.call(FA, kA, nA) === !1 || qe === 2))
          return kA.abort();
        Jn = "abort";
        for (y in { success: 1, error: 1, complete: 1 })
          kA[y](nA[y]);
        if (z = fu(xi, nA, d, kA), !z)
          st(-1, "No Transport");
        else {
          if (kA.readyState = 1, P && LA.trigger("ajaxSend", [kA, nA]), qe === 2)
            return kA;
          nA.async && nA.timeout > 0 && (I = e.setTimeout(function() {
            kA.abort("timeout");
          }, nA.timeout));
          try {
            qe = 1, z.send(oe, st);
          } catch (ue) {
            if (qe < 2)
              st(-1, ue);
            else
              throw ue;
          }
        }
        function st(ue, We, xn, va) {
          var _t, In, jn, Hn, Ke, xt = We;
          qe !== 2 && (qe = 2, I && e.clearTimeout(I), z = void 0, _ = va || "", kA.readyState = ue > 0 ? 4 : 0, _t = ue >= 200 && ue < 300 || ue === 304, xn && (Hn = Pe(nA, kA, xn)), Hn = jc(nA, Hn, kA, _t), _t ? (nA.ifModified && (Ke = kA.getResponseHeader("Last-Modified"), Ke && (o.lastModified[b] = Ke), Ke = kA.getResponseHeader("etag"), Ke && (o.etag[b] = Ke)), ue === 204 || nA.type === "HEAD" ? xt = "nocontent" : ue === 304 ? xt = "notmodified" : (xt = Hn.state, In = Hn.data, jn = Hn.error, _t = !jn)) : (jn = xt, (ue || !xt) && (xt = "error", ue < 0 && (ue = 0))), kA.status = ue, kA.statusText = (We || xt) + "", _t ? UA.resolveWith(FA, [In, xt, kA]) : UA.rejectWith(FA, [kA, xt, jn]), kA.statusCode(ZA), ZA = void 0, P && LA.trigger(
            _t ? "ajaxSuccess" : "ajaxError",
            [kA, nA, _t ? In : jn]
          ), re.fireWith(FA, [kA, xt]), P && (LA.trigger("ajaxComplete", [kA, nA]), --o.active || o.event.trigger("ajaxStop")));
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
      o[d] = function(m, y, b, _) {
        return o.isFunction(y) && (_ = _ || b, b = y, y = void 0), o.ajax(o.extend({
          url: m,
          type: d,
          dataType: _,
          data: y,
          success: b
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
    var Af = /%20/g, ef = /\[\]$/, hu = /\r?\n/g, du = /^(?:submit|button|image|reset|file)$/i, tf = /^(?:input|select|textarea|keygen)/i;
    function Ye(u, d, m, y) {
      var b;
      if (o.isArray(d))
        o.each(d, function(_, I) {
          m || ef.test(u) ? y(u, I) : Ye(
            u + "[" + (typeof I == "object" && I != null ? _ : "") + "]",
            I,
            m,
            y
          );
        });
      else if (!m && o.type(d) === "object")
        for (b in d)
          Ye(u + "[" + b + "]", d[b], m, y);
      else
        y(u, d);
    }
    o.param = function(u, d) {
      var m, y = [], b = function(_, I) {
        I = o.isFunction(I) ? I() : I ?? "", y[y.length] = encodeURIComponent(_) + "=" + encodeURIComponent(I);
      };
      if (d === void 0 && (d = o.ajaxSettings && o.ajaxSettings.traditional), o.isArray(u) || u.jquery && !o.isPlainObject(u))
        o.each(u, function() {
          b(this.name, this.value);
        });
      else
        for (m in u)
          Ye(m, u[m], d, b);
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
          return this.name && !o(this).is(":disabled") && tf.test(this.nodeName) && !du.test(u) && (this.checked || !TA.test(u));
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
            var b, _ = u.xhr(), I = ++yo;
            if (_.open(
              u.type,
              u.url,
              u.async,
              u.username,
              u.password
            ), u.xhrFields)
              for (b in u.xhrFields)
                _[b] = u.xhrFields[b];
            u.mimeType && _.overrideMimeType && _.overrideMimeType(u.mimeType), !u.crossDomain && !m["X-Requested-With"] && (m["X-Requested-With"] = "XMLHttpRequest");
            for (b in m)
              m[b] !== void 0 && _.setRequestHeader(b, m[b] + "");
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
          send: function(y, b) {
            d = i.createElement("script"), d.async = !0, u.scriptCharset && (d.charset = u.scriptCharset), d.src = u.url, d.onload = d.onreadystatechange = function(_, I) {
              (I || !d.readyState || /loaded|complete/.test(d.readyState)) && (d.onload = d.onreadystatechange = null, d.parentNode && d.parentNode.removeChild(d), d = null, I || b(200, "success"));
            }, m.insertBefore(d, m.firstChild);
          },
          abort: function() {
            d && d.onload(void 0, !0);
          }
        };
      }
    });
    var Co = [], ma = /(=)\?(?=&|$)|\?\?/;
    o.ajaxSetup({
      jsonp: "callback",
      jsonpCallback: function() {
        var u = Co.pop() || o.expando + "_" + Ba++;
        return this[u] = !0, u;
      }
    }), o.ajaxPrefilter("json jsonp", function(u, d, m) {
      var y, b, _, I = u.jsonp !== !1 && (ma.test(u.url) ? "url" : typeof u.data == "string" && (u.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && ma.test(u.data) && "data");
      if (I || u.dataTypes[0] === "jsonp")
        return y = u.jsonpCallback = o.isFunction(u.jsonpCallback) ? u.jsonpCallback() : u.jsonpCallback, I ? u[I] = u[I].replace(ma, "$1" + y) : u.jsonp !== !1 && (u.url += (wa.test(u.url) ? "&" : "?") + u.jsonp + "=" + y), u.converters["script json"] = function() {
          return _ || o.error(y + " was not called"), _[0];
        }, u.dataTypes[0] = "json", b = e[y], e[y] = function() {
          _ = arguments;
        }, m.always(function() {
          b === void 0 ? o(e).removeProp(y) : e[y] = b, u[y] && (u.jsonpCallback = d.jsonpCallback, Co.push(y)), _ && o.isFunction(b) && b(_[0]), _ = b = void 0;
        }), "script";
    }), o.parseHTML = function(u, d, m) {
      if (!u || typeof u != "string")
        return null;
      typeof d == "boolean" && (m = d, d = !1), d = d || i;
      var y = hA.exec(u), b = !m && [];
      return y ? [d.createElement(y[1])] : (y = gt([u], d, b), b && b.length && o(b).remove(), o.merge([], y.childNodes));
    };
    var Qo = o.fn.load;
    o.fn.load = function(u, d, m) {
      if (typeof u != "string" && Qo)
        return Qo.apply(this, arguments);
      var y, b, _, I = this, P = u.indexOf(" ");
      return P > -1 && (y = o.trim(u.slice(P, u.length)), u = u.slice(0, P)), o.isFunction(d) ? (m = d, d = void 0) : d && typeof d == "object" && (b = "POST"), I.length > 0 && o.ajax({
        url: u,
        // If "type" variable is undefined, then "GET" method will be used.
        // Make value of this field explicit since
        // user can override it through ajaxSetup method
        type: b || "GET",
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
        var y, b, _, I, P, z, Y, nA = o.css(u, "position"), FA = o(u), LA = {};
        nA === "static" && (u.style.position = "relative"), P = FA.offset(), _ = o.css(u, "top"), z = o.css(u, "left"), Y = (nA === "absolute" || nA === "fixed") && o.inArray("auto", [_, z]) > -1, Y ? (y = FA.position(), I = y.top, b = y.left) : (I = parseFloat(_) || 0, b = parseFloat(z) || 0), o.isFunction(d) && (d = d.call(u, m, o.extend({}, P))), d.top != null && (LA.top = d.top - P.top + I), d.left != null && (LA.left = d.left - P.left + b), "using" in d ? d.using.call(u, LA) : FA.css(LA);
      }
    }, o.fn.extend({
      offset: function(u) {
        if (arguments.length)
          return u === void 0 ? this : this.each(function(I) {
            o.offset.setOffset(this, u, I);
          });
        var d, m, y = { top: 0, left: 0 }, b = this[0], _ = b && b.ownerDocument;
        if (_)
          return d = _.documentElement, o.contains(d, b) ? (typeof b.getBoundingClientRect < "u" && (y = b.getBoundingClientRect()), m = Fo(_), {
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
        return lA(this, function(b, _, I) {
          var P = Fo(b);
          if (I === void 0)
            return P ? d in P ? P[d] : P.document.documentElement[_] : b[_];
          P ? P.scrollTo(
            m ? o(P).scrollLeft() : I,
            m ? I : o(P).scrollTop()
          ) : b[_] = I;
        }, u, y, arguments.length, null);
      };
    }), o.each(["top", "left"], function(u, d) {
      o.cssHooks[d] = ho(
        p.pixelPosition,
        function(m, y) {
          if (y)
            return y = zn(m, d), la.test(y) ? o(m).position()[d] + "px" : y;
        }
      );
    }), o.each({ Height: "height", Width: "width" }, function(u, d) {
      o.each(
        { padding: "inner" + u, content: d, "": "outer" + u },
        function(m, y) {
          o.fn[y] = function(b, _) {
            var I = arguments.length && (m || typeof b != "boolean"), P = m || (b === !0 || _ === !0 ? "margin" : "border");
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
            }, d, I ? b : void 0, I, null);
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
})(i0);
var gD = i0.exports;
const ae = /* @__PURE__ */ vc(gD), BD = function(A) {
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
  }, t = _e.merge({}, e, A), n = function(s) {
    return s < 1e3 ? s : s < 1e6 ? (s / 1e3).toFixed(1) + "Kb" : (s / 1e6).toFixed(1) + "Mb";
  };
  function i(s) {
    s.each(function(l) {
      var f = WA(this).selectAll(".chromosome-label").data([l]), c = f.enter().append("g").attr("class", "chromosome-label");
      c.append("text"), t.border && c.append("rect").classed("border", !0), WA(this).selectAll(".chromosome-label").attr("transform", function(p) {
        return "translate(" + t.layout.x + "," + t.layout.y + ")";
      }), WA(this).selectAll(".chromosome-label").selectAll("text").attr("x", t.layout.width * 0.5).attr("y", t.layout.height * 0.5).style(
        "font-size",
        Math.max(14 / t.scale, t.layout.chromosomeWidth * 1.2) + "px"
      ).text(l.number).on("click", t.onLabelSelectFunction), t.border && f.select("rect").attr("width", t.layout.width).attr("height", t.layout.height), f.exit().remove();
      var h = WA(this).selectAll(".chromosome-size-label").data([l]);
      c = h.enter().append("g").attr("class", "chromosome-size-label"), c.append("text");
      var w = 10 + t.sizeLayout.y + t.sizeLayout.cellHeight * l.length / t.longestChromosome, B = 1.2 * t.labelSize / Math.min(5, t.scale) + "px";
      WA(this).selectAll(".chromosome-size-label").attr(
        "transform",
        "translate(" + t.sizeLayout.x + "," + w + ")"
      ), h = WA(this).selectAll(".chromosome-size-label").select("text").attr("x", t.sizeLayout.width * 0.5).attr("y", 0).attr("dy", "1em").style("font-size", B).text(n(l.length)), h.exit().remove();
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
}, wD = function(A) {
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
  }, t = _e.merge({}, e, A), n = function() {
    return oa().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, i = function(h) {
    var w = n(), B = w(h.length), p = WA(this);
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
      D.enter().append("rect").attr("class", "selection").style("fill", "gray").style("opacity", 0.2), D.attr("x", 0).attr("y", function(E) {
        return Math.min(E.start, E.end);
      }).attr("width", t.layout.width).attr("height", function(E) {
        return Math.abs(E.end - E.start);
      }), D.exit().remove();
    }, F = YS().on("start", function(D) {
      var E = kn(D, this);
      o.push({
        start: E[1],
        end: E[1]
      }), C(), D.sourceEvent.stopPropagation();
    }).on("drag", function(D) {
      o[0].end = kn(D, this)[1], C(), D.sourceEvent.stopPropagation(), D.sourceEvent.preventDefault();
    }).on("end", function(D) {
      D.sourceEvent.stopPropagation();
      var E = w.invert(o[0].start), M = w.invert(o[0].end);
      if (E > M) {
        var K = E;
        E = M, M = K;
      }
      var J = h.layout.geneBandNodes.filter(function(hA) {
        return hA.data.midpoint > E && hA.data.midpoint < M;
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
      WA(this).attr("y", F.y).attr("height", F.height).attr("fill", F.fill).attr("width", F.width).attr("fill-opacity", F["fill-opacity"]).attr("stroke-dasharray", F["stroke-dasharray"]).attr("stroke-width", F["stroke-width"]);
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
      var B = WA(this).selectAll(".chromosome").data([w]), p = B.enter().append("g").attr("class", "chromosome");
      p.append("defs"), p.append("rect").classed("background", !0), p.append("g").classed("bands_container", !0), p.append("rect").classed("outline", !0), t.border && p.append("rect").classed("border", !0), WA(this).selectAll(".chromosome").each(i), B.exit().remove();
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
var Zt = "top", Qn = "bottom", Fn = "right", An = "left", Hp = "auto", Ms = [Zt, Qn, Fn, An], to = "start", bs = "end", mD = "clippingParents", a0 = "viewport", Xo = "popper", vD = "reference", bw = /* @__PURE__ */ Ms.reduce(function(A, e) {
  return A.concat([e + "-" + to, e + "-" + bs]);
}, []), o0 = /* @__PURE__ */ [].concat(Ms, [Hp]).reduce(function(A, e) {
  return A.concat([e, e + "-" + to, e + "-" + bs]);
}, []), yD = "beforeRead", CD = "read", QD = "afterRead", FD = "beforeMain", UD = "main", bD = "afterMain", ED = "beforeWrite", _D = "write", xD = "afterWrite", ID = [yD, CD, QD, FD, UD, bD, ED, _D, xD];
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
function aa(A) {
  var e = sn(A).Element;
  return A instanceof e || A instanceof Element;
}
function Cn(A) {
  var e = sn(A).HTMLElement;
  return A instanceof e || A instanceof HTMLElement;
}
function Sp(A) {
  if (typeof ShadowRoot > "u")
    return !1;
  var e = sn(A).ShadowRoot;
  return A instanceof e || A instanceof ShadowRoot;
}
function HD(A) {
  var e = A.state;
  Object.keys(e.elements).forEach(function(t) {
    var n = e.styles[t] || {}, i = e.attributes[t] || {}, s = e.elements[t];
    !Cn(s) || !ur(s) || (Object.assign(s.style, n), Object.keys(i).forEach(function(l) {
      var f = i[l];
      f === !1 ? s.removeAttribute(l) : s.setAttribute(l, f === !0 ? "" : f);
    }));
  });
}
function SD(A) {
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
const s0 = {
  name: "applyStyles",
  enabled: !0,
  phase: "write",
  fn: HD,
  effect: SD,
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
function u0() {
  return !/^((?!chrome|android).)*safari/i.test(ed());
}
function ro(A, e, t) {
  e === void 0 && (e = !1), t === void 0 && (t = !1);
  var n = A.getBoundingClientRect(), i = 1, s = 1;
  e && Cn(A) && (i = A.offsetWidth > 0 && no(n.width) / A.offsetWidth || 1, s = A.offsetHeight > 0 && no(n.height) / A.offsetHeight || 1);
  var l = aa(A) ? sn(A) : window, f = l.visualViewport, c = !u0() && t, h = (n.left + (c && f ? f.offsetLeft : 0)) / i, w = (n.top + (c && f ? f.offsetTop : 0)) / s, B = n.width / i, p = n.height / s;
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
function Lp(A) {
  var e = ro(A), t = A.offsetWidth, n = A.offsetHeight;
  return Math.abs(e.width - t) <= 1 && (t = e.width), Math.abs(e.height - n) <= 1 && (n = e.height), {
    x: A.offsetLeft,
    y: A.offsetTop,
    width: t,
    height: n
  };
}
function l0(A, e) {
  var t = e.getRootNode && e.getRootNode();
  if (A.contains(e))
    return !0;
  if (t && Sp(t)) {
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
function LD(A) {
  return ["table", "td", "th"].indexOf(ur(A)) >= 0;
}
function Ci(A) {
  return ((aa(A) ? A.ownerDocument : (
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
    (Sp(A) ? A.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    Ci(A)
  );
}
function Ew(A) {
  return !Cn(A) || // https://github.com/popperjs/popper-core/issues/837
  kr(A).position === "fixed" ? null : A.offsetParent;
}
function TD(A) {
  var e = /firefox/i.test(ed()), t = /Trident/i.test(ed());
  if (t && Cn(A)) {
    var n = kr(A);
    if (n.position === "fixed")
      return null;
  }
  var i = Hc(A);
  for (Sp(i) && (i = i.host); Cn(i) && ["html", "body"].indexOf(ur(i)) < 0; ) {
    var s = kr(i);
    if (s.transform !== "none" || s.perspective !== "none" || s.contain === "paint" || ["transform", "perspective"].indexOf(s.willChange) !== -1 || e && s.willChange === "filter" || e && s.filter && s.filter !== "none")
      return i;
    i = i.parentNode;
  }
  return null;
}
function Ps(A) {
  for (var e = sn(A), t = Ew(A); t && LD(t) && kr(t).position === "static"; )
    t = Ew(t);
  return t && (ur(t) === "html" || ur(t) === "body" && kr(t).position === "static") ? e : t || TD(A) || e;
}
function Tp(A) {
  return ["top", "bottom"].indexOf(A) >= 0 ? "x" : "y";
}
function hs(A, e, t) {
  return Zi(A, sc(e, t));
}
function DD(A, e, t) {
  var n = hs(A, e, t);
  return n > t ? t : n;
}
function c0() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}
function f0(A) {
  return Object.assign({}, c0(), A);
}
function h0(A, e) {
  return e.reduce(function(t, n) {
    return t[n] = A, t;
  }, {});
}
var OD = function(e, t) {
  return e = typeof e == "function" ? e(Object.assign({}, t.rects, {
    placement: t.placement
  })) : e, f0(typeof e != "number" ? e : h0(e, Ms));
};
function ND(A) {
  var e, t = A.state, n = A.name, i = A.options, s = t.elements.arrow, l = t.modifiersData.popperOffsets, f = sr(t.placement), c = Tp(f), h = [An, Fn].indexOf(f) >= 0, w = h ? "height" : "width";
  if (!(!s || !l)) {
    var B = OD(i.padding, t), p = Lp(s), v = c === "y" ? Zt : An, o = c === "y" ? Qn : Fn, C = t.rects.reference[w] + t.rects.reference[c] - l[c] - t.rects.popper[w], F = l[c] - t.rects.reference[c], U = Ps(s), H = U ? c === "y" ? U.clientHeight || 0 : U.clientWidth || 0 : 0, D = C / 2 - F / 2, E = B[v], M = H - p[w] - B[o], K = H / 2 - p[w] / 2 + D, J = hs(E, K, M), hA = c;
    t.modifiersData[n] = (e = {}, e[hA] = J, e.centerOffset = J - K, e);
  }
}
function MD(A) {
  var e = A.state, t = A.options, n = t.element, i = n === void 0 ? "[data-popper-arrow]" : n;
  i != null && (typeof i == "string" && (i = e.elements.popper.querySelector(i), !i) || l0(e.elements.popper, i) && (e.elements.arrow = i));
}
const PD = {
  name: "arrow",
  enabled: !0,
  phase: "main",
  fn: ND,
  effect: MD,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};
function io(A) {
  return A.split("-")[1];
}
var KD = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function RD(A, e) {
  var t = A.x, n = A.y, i = e.devicePixelRatio || 1;
  return {
    x: no(t * i) / i || 0,
    y: no(n * i) / i || 0
  };
}
function _w(A) {
  var e, t = A.popper, n = A.popperRect, i = A.placement, s = A.variation, l = A.offsets, f = A.position, c = A.gpuAcceleration, h = A.adaptive, w = A.roundOffsets, B = A.isFixed, p = l.x, v = p === void 0 ? 0 : p, o = l.y, C = o === void 0 ? 0 : o, F = typeof w == "function" ? w({
    x: v,
    y: C
  }) : {
    x: v,
    y: C
  };
  v = F.x, C = F.y;
  var U = l.hasOwnProperty("x"), H = l.hasOwnProperty("y"), D = An, E = Zt, M = window;
  if (h) {
    var K = Ps(t), J = "clientHeight", hA = "clientWidth";
    if (K === sn(t) && (K = Ci(t), kr(K).position !== "static" && f === "absolute" && (J = "scrollHeight", hA = "scrollWidth")), K = K, i === Zt || (i === An || i === Fn) && s === bs) {
      E = Qn;
      var cA = B && K === M && M.visualViewport ? M.visualViewport.height : (
        // $FlowFixMe[prop-missing]
        K[J]
      );
      C -= cA - n.height, C *= c ? 1 : -1;
    }
    if (i === An || (i === Zt || i === Qn) && s === bs) {
      D = Fn;
      var wA = B && K === M && M.visualViewport ? M.visualViewport.width : (
        // $FlowFixMe[prop-missing]
        K[hA]
      );
      v -= wA - n.width, v *= c ? 1 : -1;
    }
  }
  var QA = Object.assign({
    position: f
  }, h && KD), OA = w === !0 ? RD({
    x: v,
    y: C
  }, sn(t)) : {
    x: v,
    y: C
  };
  if (v = OA.x, C = OA.y, c) {
    var EA;
    return Object.assign({}, QA, (EA = {}, EA[E] = H ? "0" : "", EA[D] = U ? "0" : "", EA.transform = (M.devicePixelRatio || 1) <= 1 ? "translate(" + v + "px, " + C + "px)" : "translate3d(" + v + "px, " + C + "px, 0)", EA));
  }
  return Object.assign({}, QA, (e = {}, e[E] = H ? C + "px" : "", e[D] = U ? v + "px" : "", e.transform = "", e));
}
function kD(A) {
  var e = A.state, t = A.options, n = t.gpuAcceleration, i = n === void 0 ? !0 : n, s = t.adaptive, l = s === void 0 ? !0 : s, f = t.roundOffsets, c = f === void 0 ? !0 : f, h = {
    placement: sr(e.placement),
    variation: io(e.placement),
    popper: e.elements.popper,
    popperRect: e.rects.popper,
    gpuAcceleration: i,
    isFixed: e.options.strategy === "fixed"
  };
  e.modifiersData.popperOffsets != null && (e.styles.popper = Object.assign({}, e.styles.popper, _w(Object.assign({}, h, {
    offsets: e.modifiersData.popperOffsets,
    position: e.options.strategy,
    adaptive: l,
    roundOffsets: c
  })))), e.modifiersData.arrow != null && (e.styles.arrow = Object.assign({}, e.styles.arrow, _w(Object.assign({}, h, {
    offsets: e.modifiersData.arrow,
    position: "absolute",
    adaptive: !1,
    roundOffsets: c
  })))), e.attributes.popper = Object.assign({}, e.attributes.popper, {
    "data-popper-placement": e.placement
  });
}
const $D = {
  name: "computeStyles",
  enabled: !0,
  phase: "beforeWrite",
  fn: kD,
  data: {}
};
var al = {
  passive: !0
};
function GD(A) {
  var e = A.state, t = A.instance, n = A.options, i = n.scroll, s = i === void 0 ? !0 : i, l = n.resize, f = l === void 0 ? !0 : l, c = sn(e.elements.popper), h = [].concat(e.scrollParents.reference, e.scrollParents.popper);
  return s && h.forEach(function(w) {
    w.addEventListener("scroll", t.update, al);
  }), f && c.addEventListener("resize", t.update, al), function() {
    s && h.forEach(function(w) {
      w.removeEventListener("scroll", t.update, al);
    }), f && c.removeEventListener("resize", t.update, al);
  };
}
const VD = {
  name: "eventListeners",
  enabled: !0,
  phase: "write",
  fn: function() {
  },
  effect: GD,
  data: {}
};
var WD = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function kl(A) {
  return A.replace(/left|right|bottom|top/g, function(e) {
    return WD[e];
  });
}
var XD = {
  start: "end",
  end: "start"
};
function xw(A) {
  return A.replace(/start|end/g, function(e) {
    return XD[e];
  });
}
function Dp(A) {
  var e = sn(A), t = e.pageXOffset, n = e.pageYOffset;
  return {
    scrollLeft: t,
    scrollTop: n
  };
}
function Op(A) {
  return ro(Ci(A)).left + Dp(A).scrollLeft;
}
function qD(A, e) {
  var t = sn(A), n = Ci(A), i = t.visualViewport, s = n.clientWidth, l = n.clientHeight, f = 0, c = 0;
  if (i) {
    s = i.width, l = i.height;
    var h = u0();
    (h || !h && e === "fixed") && (f = i.offsetLeft, c = i.offsetTop);
  }
  return {
    width: s,
    height: l,
    x: f + Op(A),
    y: c
  };
}
function zD(A) {
  var e, t = Ci(A), n = Dp(A), i = (e = A.ownerDocument) == null ? void 0 : e.body, s = Zi(t.scrollWidth, t.clientWidth, i ? i.scrollWidth : 0, i ? i.clientWidth : 0), l = Zi(t.scrollHeight, t.clientHeight, i ? i.scrollHeight : 0, i ? i.clientHeight : 0), f = -n.scrollLeft + Op(A), c = -n.scrollTop;
  return kr(i || t).direction === "rtl" && (f += Zi(t.clientWidth, i ? i.clientWidth : 0) - s), {
    width: s,
    height: l,
    x: f,
    y: c
  };
}
function Np(A) {
  var e = kr(A), t = e.overflow, n = e.overflowX, i = e.overflowY;
  return /auto|scroll|overlay|hidden/.test(t + i + n);
}
function d0(A) {
  return ["html", "body", "#document"].indexOf(ur(A)) >= 0 ? A.ownerDocument.body : Cn(A) && Np(A) ? A : d0(Hc(A));
}
function ds(A, e) {
  var t;
  e === void 0 && (e = []);
  var n = d0(A), i = n === ((t = A.ownerDocument) == null ? void 0 : t.body), s = sn(n), l = i ? [s].concat(s.visualViewport || [], Np(n) ? n : []) : n, f = e.concat(l);
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
function JD(A, e) {
  var t = ro(A, !1, e === "fixed");
  return t.top = t.top + A.clientTop, t.left = t.left + A.clientLeft, t.bottom = t.top + A.clientHeight, t.right = t.left + A.clientWidth, t.width = A.clientWidth, t.height = A.clientHeight, t.x = t.left, t.y = t.top, t;
}
function Iw(A, e, t) {
  return e === a0 ? td(qD(A, t)) : aa(e) ? JD(e, t) : td(zD(Ci(A)));
}
function jD(A) {
  var e = ds(Hc(A)), t = ["absolute", "fixed"].indexOf(kr(A).position) >= 0, n = t && Cn(A) ? Ps(A) : A;
  return aa(n) ? e.filter(function(i) {
    return aa(i) && l0(i, n) && ur(i) !== "body";
  }) : [];
}
function YD(A, e, t, n) {
  var i = e === "clippingParents" ? jD(A) : [].concat(e), s = [].concat(i, [t]), l = s[0], f = s.reduce(function(c, h) {
    var w = Iw(A, h, n);
    return c.top = Zi(w.top, c.top), c.right = sc(w.right, c.right), c.bottom = sc(w.bottom, c.bottom), c.left = Zi(w.left, c.left), c;
  }, Iw(A, l, n));
  return f.width = f.right - f.left, f.height = f.bottom - f.top, f.x = f.left, f.y = f.top, f;
}
function p0(A) {
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
  var h = i ? Tp(i) : null;
  if (h != null) {
    var w = h === "y" ? "height" : "width";
    switch (s) {
      case to:
        c[h] = c[h] - (e[w] / 2 - t[w] / 2);
        break;
      case bs:
        c[h] = c[h] + (e[w] / 2 - t[w] / 2);
        break;
    }
  }
  return c;
}
function Es(A, e) {
  e === void 0 && (e = {});
  var t = e, n = t.placement, i = n === void 0 ? A.placement : n, s = t.strategy, l = s === void 0 ? A.strategy : s, f = t.boundary, c = f === void 0 ? mD : f, h = t.rootBoundary, w = h === void 0 ? a0 : h, B = t.elementContext, p = B === void 0 ? Xo : B, v = t.altBoundary, o = v === void 0 ? !1 : v, C = t.padding, F = C === void 0 ? 0 : C, U = f0(typeof F != "number" ? F : h0(F, Ms)), H = p === Xo ? vD : Xo, D = A.rects.popper, E = A.elements[o ? H : p], M = YD(aa(E) ? E : E.contextElement || Ci(A.elements.popper), c, w, l), K = ro(A.elements.reference), J = p0({
    reference: K,
    element: D,
    strategy: "absolute",
    placement: i
  }), hA = td(Object.assign({}, D, J)), cA = p === Xo ? hA : K, wA = {
    top: M.top - cA.top + U.top,
    bottom: cA.bottom - M.bottom + U.bottom,
    left: M.left - cA.left + U.left,
    right: cA.right - M.right + U.right
  }, QA = A.modifiersData.offset;
  if (p === Xo && QA) {
    var OA = QA[i];
    Object.keys(wA).forEach(function(EA) {
      var q = [Fn, Qn].indexOf(EA) >= 0 ? 1 : -1, CA = [Zt, Qn].indexOf(EA) >= 0 ? "y" : "x";
      wA[EA] += OA[CA] * q;
    });
  }
  return wA;
}
function ZD(A, e) {
  e === void 0 && (e = {});
  var t = e, n = t.placement, i = t.boundary, s = t.rootBoundary, l = t.padding, f = t.flipVariations, c = t.allowedAutoPlacements, h = c === void 0 ? o0 : c, w = io(n), B = w ? f ? bw : bw.filter(function(o) {
    return io(o) === w;
  }) : Ms, p = B.filter(function(o) {
    return h.indexOf(o) >= 0;
  });
  p.length === 0 && (p = B);
  var v = p.reduce(function(o, C) {
    return o[C] = Es(A, {
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
function AO(A) {
  if (sr(A) === Hp)
    return [];
  var e = kl(A);
  return [xw(A), e, xw(e)];
}
function eO(A) {
  var e = A.state, t = A.options, n = A.name;
  if (!e.modifiersData[n]._skip) {
    for (var i = t.mainAxis, s = i === void 0 ? !0 : i, l = t.altAxis, f = l === void 0 ? !0 : l, c = t.fallbackPlacements, h = t.padding, w = t.boundary, B = t.rootBoundary, p = t.altBoundary, v = t.flipVariations, o = v === void 0 ? !0 : v, C = t.allowedAutoPlacements, F = e.options.placement, U = sr(F), H = U === F, D = c || (H || !o ? [kl(F)] : AO(F)), E = [F].concat(D).reduce(function(S, R) {
      return S.concat(sr(R) === Hp ? ZD(e, {
        placement: R,
        boundary: w,
        rootBoundary: B,
        padding: h,
        flipVariations: o,
        allowedAutoPlacements: C
      }) : R);
    }, []), M = e.rects.reference, K = e.rects.popper, J = /* @__PURE__ */ new Map(), hA = !0, cA = E[0], wA = 0; wA < E.length; wA++) {
      var QA = E[wA], OA = sr(QA), EA = io(QA) === to, q = [Zt, Qn].indexOf(OA) >= 0, CA = q ? "width" : "height", iA = Es(e, {
        placement: QA,
        boundary: w,
        rootBoundary: B,
        altBoundary: p,
        padding: h
      }), gA = q ? EA ? Fn : An : EA ? Qn : Zt;
      M[CA] > K[CA] && (gA = kl(gA));
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
      for (var uA = o ? 3 : 1, T = function(R) {
        var aA = E.find(function(bA) {
          var _A = J.get(bA);
          if (_A)
            return _A.slice(0, R).every(function(zA) {
              return zA;
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
const tO = {
  name: "flip",
  enabled: !0,
  phase: "main",
  fn: eO,
  requiresIfExists: ["offset"],
  data: {
    _skip: !1
  }
};
function Hw(A, e, t) {
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
function Sw(A) {
  return [Zt, Fn, Qn, An].some(function(e) {
    return A[e] >= 0;
  });
}
function nO(A) {
  var e = A.state, t = A.name, n = e.rects.reference, i = e.rects.popper, s = e.modifiersData.preventOverflow, l = Es(e, {
    elementContext: "reference"
  }), f = Es(e, {
    altBoundary: !0
  }), c = Hw(l, n), h = Hw(f, i, s), w = Sw(c), B = Sw(h);
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
const rO = {
  name: "hide",
  enabled: !0,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: nO
};
function iO(A, e, t) {
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
function aO(A) {
  var e = A.state, t = A.options, n = A.name, i = t.offset, s = i === void 0 ? [0, 0] : i, l = o0.reduce(function(w, B) {
    return w[B] = iO(B, e.rects, s), w;
  }, {}), f = l[e.placement], c = f.x, h = f.y;
  e.modifiersData.popperOffsets != null && (e.modifiersData.popperOffsets.x += c, e.modifiersData.popperOffsets.y += h), e.modifiersData[n] = l;
}
const oO = {
  name: "offset",
  enabled: !0,
  phase: "main",
  requires: ["popperOffsets"],
  fn: aO
};
function sO(A) {
  var e = A.state, t = A.name;
  e.modifiersData[t] = p0({
    reference: e.rects.reference,
    element: e.rects.popper,
    strategy: "absolute",
    placement: e.placement
  });
}
const uO = {
  name: "popperOffsets",
  enabled: !0,
  phase: "read",
  fn: sO,
  data: {}
};
function lO(A) {
  return A === "x" ? "y" : "x";
}
function cO(A) {
  var e = A.state, t = A.options, n = A.name, i = t.mainAxis, s = i === void 0 ? !0 : i, l = t.altAxis, f = l === void 0 ? !1 : l, c = t.boundary, h = t.rootBoundary, w = t.altBoundary, B = t.padding, p = t.tether, v = p === void 0 ? !0 : p, o = t.tetherOffset, C = o === void 0 ? 0 : o, F = Es(e, {
    boundary: c,
    rootBoundary: h,
    padding: B,
    altBoundary: w
  }), U = sr(e.placement), H = io(e.placement), D = !H, E = Tp(U), M = lO(E), K = e.modifiersData.popperOffsets, J = e.rects.reference, hA = e.rects.popper, cA = typeof C == "function" ? C(Object.assign({}, e.rects, {
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
  if (K) {
    if (s) {
      var EA, q = E === "y" ? Zt : An, CA = E === "y" ? Qn : Fn, iA = E === "y" ? "height" : "width", gA = K[E], IA = gA + F[q], HA = gA - F[CA], uA = v ? -hA[iA] / 2 : 0, T = H === to ? J[iA] : hA[iA], rA = H === to ? -hA[iA] : -J[iA], j = e.elements.arrow, S = v && j ? Lp(j) : {
        width: 0,
        height: 0
      }, R = e.modifiersData["arrow#persistent"] ? e.modifiersData["arrow#persistent"].padding : c0(), aA = R[q], bA = R[CA], _A = hs(0, J[iA], S[iA]), zA = D ? J[iA] / 2 - uA - _A - aA - wA.mainAxis : T - _A - aA - wA.mainAxis, JA = D ? -J[iA] / 2 + uA + _A + bA + wA.mainAxis : rA + _A + bA + wA.mainAxis, X = e.elements.arrow && Ps(e.elements.arrow), V = X ? E === "y" ? X.clientTop || 0 : X.clientLeft || 0 : 0, k = (EA = QA == null ? void 0 : QA[E]) != null ? EA : 0, eA = gA + zA - k - V, lA = gA + JA - k, TA = hs(v ? sc(IA, eA) : IA, gA, v ? Zi(HA, lA) : HA);
      K[E] = TA, OA[E] = TA - gA;
    }
    if (f) {
      var jA, se = E === "x" ? Zt : An, xe = E === "x" ? Qn : Fn, fe = K[M], he = M === "y" ? "height" : "width", Te = fe + F[se], ce = fe - F[xe], Dt = [Zt, An].indexOf(U) !== -1, Ft = (jA = QA == null ? void 0 : QA[M]) != null ? jA : 0, Ot = Dt ? Te : fe - J[he] - hA[he] - Ft + wA.altAxis, Ut = Dt ? fe + J[he] + hA[he] - Ft - wA.altAxis : ce, gt = v && Dt ? DD(Ot, fe, Ut) : hs(v ? Ot : Te, fe, v ? Ut : ce);
      K[M] = gt, OA[M] = gt - fe;
    }
    e.modifiersData[n] = OA;
  }
}
const fO = {
  name: "preventOverflow",
  enabled: !0,
  phase: "main",
  fn: cO,
  requiresIfExists: ["offset"]
};
function hO(A) {
  return {
    scrollLeft: A.scrollLeft,
    scrollTop: A.scrollTop
  };
}
function dO(A) {
  return A === sn(A) || !Cn(A) ? Dp(A) : hO(A);
}
function pO(A) {
  var e = A.getBoundingClientRect(), t = no(e.width) / A.offsetWidth || 1, n = no(e.height) / A.offsetHeight || 1;
  return t !== 1 || n !== 1;
}
function gO(A, e, t) {
  t === void 0 && (t = !1);
  var n = Cn(e), i = Cn(e) && pO(e), s = Ci(e), l = ro(A, i, t), f = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = {
    x: 0,
    y: 0
  };
  return (n || !n && !t) && ((ur(e) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
  Np(s)) && (f = dO(e)), Cn(e) ? (c = ro(e, !0), c.x += e.clientLeft, c.y += e.clientTop) : s && (c.x = Op(s))), {
    x: l.left + f.scrollLeft - c.x,
    y: l.top + f.scrollTop - c.y,
    width: l.width,
    height: l.height
  };
}
function BO(A) {
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
function wO(A) {
  var e = BO(A);
  return ID.reduce(function(t, n) {
    return t.concat(e.filter(function(i) {
      return i.phase === n;
    }));
  }, []);
}
function mO(A) {
  var e;
  return function() {
    return e || (e = new Promise(function(t) {
      Promise.resolve().then(function() {
        e = void 0, t(A());
      });
    })), e;
  };
}
function vO(A) {
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
var Lw = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function Tw() {
  for (var A = arguments.length, e = new Array(A), t = 0; t < A; t++)
    e[t] = arguments[t];
  return !e.some(function(n) {
    return !(n && typeof n.getBoundingClientRect == "function");
  });
}
function yO(A) {
  A === void 0 && (A = {});
  var e = A, t = e.defaultModifiers, n = t === void 0 ? [] : t, i = e.defaultOptions, s = i === void 0 ? Lw : i;
  return function(f, c, h) {
    h === void 0 && (h = s);
    var w = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, Lw, s),
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
          reference: aa(f) ? ds(f) : f.contextElement ? ds(f.contextElement) : [],
          popper: ds(c)
        };
        var D = wO(vO([].concat(n, w.options.modifiers)));
        return w.orderedModifiers = D.filter(function(E) {
          return E.enabled;
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
          if (Tw(H, D)) {
            w.rects = {
              reference: gO(H, Ps(D), w.options.strategy === "fixed"),
              popper: Lp(D)
            }, w.reset = !1, w.placement = w.options.placement, w.orderedModifiers.forEach(function(wA) {
              return w.modifiersData[wA.name] = Object.assign({}, wA.data);
            });
            for (var E = 0; E < w.orderedModifiers.length; E++) {
              if (w.reset === !0) {
                w.reset = !1, E = -1;
                continue;
              }
              var M = w.orderedModifiers[E], K = M.fn, J = M.options, hA = J === void 0 ? {} : J, cA = M.name;
              typeof K == "function" && (w = K({
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
      update: mO(function() {
        return new Promise(function(F) {
          v.forceUpdate(), F(w);
        });
      }),
      destroy: function() {
        C(), p = !0;
      }
    };
    if (!Tw(f, c))
      return v;
    v.setOptions(h).then(function(F) {
      !p && h.onFirstUpdate && h.onFirstUpdate(F);
    });
    function o() {
      w.orderedModifiers.forEach(function(F) {
        var U = F.name, H = F.options, D = H === void 0 ? {} : H, E = F.effect;
        if (typeof E == "function") {
          var M = E({
            state: w,
            name: U,
            instance: v,
            options: D
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
var CO = [VD, uO, $D, s0, oO, tO, fO, PD, rO], QO = /* @__PURE__ */ yO({
  defaultModifiers: CO
}), FO = "tippy-box", g0 = "tippy-content", UO = "tippy-backdrop", B0 = "tippy-arrow", w0 = "tippy-svg-arrow", Vi = {
  passive: !0,
  capture: !0
}, m0 = function() {
  return document.body;
};
function bO(A, e) {
  return {}.hasOwnProperty.call(A, e);
}
function uh(A, e, t) {
  if (Array.isArray(A)) {
    var n = A[e];
    return n ?? (Array.isArray(t) ? t[e] : t);
  }
  return A;
}
function Mp(A, e) {
  var t = {}.toString.call(A);
  return t.indexOf("[object") === 0 && t.indexOf(e + "]") > -1;
}
function v0(A, e) {
  return typeof A == "function" ? A.apply(void 0, e) : A;
}
function Dw(A, e) {
  if (e === 0)
    return A;
  var t;
  return function(n) {
    clearTimeout(t), t = setTimeout(function() {
      A(n);
    }, e);
  };
}
function EO(A, e) {
  var t = Object.assign({}, A);
  return e.forEach(function(n) {
    delete t[n];
  }), t;
}
function _O(A) {
  return A.split(/\s+/).filter(Boolean);
}
function Ra(A) {
  return [].concat(A);
}
function Ow(A, e) {
  A.indexOf(e) === -1 && A.push(e);
}
function xO(A) {
  return A.filter(function(e, t) {
    return A.indexOf(e) === t;
  });
}
function IO(A) {
  return A.split("-")[0];
}
function uc(A) {
  return [].slice.call(A);
}
function Nw(A) {
  return Object.keys(A).reduce(function(e, t) {
    return A[t] !== void 0 && (e[t] = A[t]), e;
  }, {});
}
function ps() {
  return document.createElement("div");
}
function _s(A) {
  return ["Element", "Fragment"].some(function(e) {
    return Mp(A, e);
  });
}
function HO(A) {
  return Mp(A, "NodeList");
}
function SO(A) {
  return Mp(A, "MouseEvent");
}
function LO(A) {
  return !!(A && A._tippy && A._tippy.reference === A);
}
function TO(A) {
  return _s(A) ? [A] : HO(A) ? uc(A) : Array.isArray(A) ? A : uc(document.querySelectorAll(A));
}
function lh(A, e) {
  A.forEach(function(t) {
    t && (t.style.transitionDuration = e + "ms");
  });
}
function Mw(A, e) {
  A.forEach(function(t) {
    t && t.setAttribute("data-state", e);
  });
}
function DO(A) {
  var e, t = Ra(A), n = t[0];
  return n != null && (e = n.ownerDocument) != null && e.body ? n.ownerDocument : document;
}
function OO(A, e) {
  var t = e.clientX, n = e.clientY;
  return A.every(function(i) {
    var s = i.popperRect, l = i.popperState, f = i.props, c = f.interactiveBorder, h = IO(l.placement), w = l.modifiersData.offset;
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
function Pw(A, e) {
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
function NO() {
  ir.isTouch || (ir.isTouch = !0, window.performance && document.addEventListener("mousemove", y0));
}
function y0() {
  var A = performance.now();
  A - Kw < 20 && (ir.isTouch = !1, document.removeEventListener("mousemove", y0)), Kw = A;
}
function MO() {
  var A = document.activeElement;
  if (LO(A)) {
    var e = A._tippy;
    A.blur && !e.state.isVisible && A.blur();
  }
}
function PO() {
  document.addEventListener("touchstart", NO, Vi), window.addEventListener("blur", MO);
}
var KO = typeof window < "u" && typeof document < "u", RO = KO ? (
  // @ts-ignore
  !!window.msCrypto
) : !1;
function La(A) {
  var e = A === "destroy" ? "n already-" : " ";
  return [A + "() was called on a" + e + "destroyed instance. This is a no-op but", "indicates a potential memory leak."].join(" ");
}
function Rw(A) {
  var e = /[ \t]{2,}/g, t = /^[ \t]*/gm;
  return A.replace(e, " ").replace(t, "").trim();
}
function kO(A) {
  return Rw(`
  %ctippy.js

  %c` + Rw(A) + `

  %c👷‍ This is a development-only message. It will be removed in production.
  `);
}
function C0(A) {
  return [
    kO(A),
    // title
    "color: #00C584; font-size: 1.3em; font-weight: bold;",
    // message
    "line-height: 1.5",
    // footer
    "color: #a6a095;"
  ];
}
var xs;
process.env.NODE_ENV !== "production" && $O();
function $O() {
  xs = /* @__PURE__ */ new Set();
}
function Nr(A, e) {
  if (A && !xs.has(e)) {
    var t;
    xs.add(e), (t = console).warn.apply(t, C0(e));
  }
}
function nd(A, e) {
  if (A && !xs.has(e)) {
    var t;
    xs.add(e), (t = console).error.apply(t, C0(e));
  }
}
function GO(A) {
  var e = !A, t = Object.prototype.toString.call(A) === "[object Object]" && !A.addEventListener;
  nd(e, ["tippy() was passed", "`" + String(A) + "`", "as its targets (first) argument. Valid types are: String, Element,", "Element[], or NodeList."].join(" ")), nd(t, ["tippy() was passed a plain object which is not supported as an argument", "for virtual positioning. Use props.getReferenceClientRect instead."].join(" "));
}
var Q0 = {
  animateFill: !1,
  followCursor: !1,
  inlinePositioning: !1,
  sticky: !1
}, VO = {
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
  appendTo: m0,
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
}, Q0, VO), WO = Object.keys(on), XO = function(e) {
  process.env.NODE_ENV !== "production" && U0(e, []);
  var t = Object.keys(e);
  t.forEach(function(n) {
    on[n] = e[n];
  });
};
function F0(A) {
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
function qO(A, e) {
  var t = e ? Object.keys(F0(Object.assign({}, on, {
    plugins: e
  }))) : WO, n = t.reduce(function(i, s) {
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
function kw(A, e) {
  var t = Object.assign({}, e, {
    content: v0(e.content, [A])
  }, e.ignoreAttributes ? {} : qO(A, e.plugins));
  return t.aria = Object.assign({}, on.aria, t.aria), t.aria = {
    expanded: t.aria.expanded === "auto" ? e.interactive : t.aria.expanded,
    content: t.aria.content === "auto" ? e.interactive ? null : "describedby" : t.aria.content
  }, t;
}
function U0(A, e) {
  A === void 0 && (A = {}), e === void 0 && (e = []);
  var t = Object.keys(A);
  t.forEach(function(n) {
    var i = EO(on, Object.keys(Q0)), s = !bO(i, n);
    s && (s = e.filter(function(l) {
      return l.name === n;
    }).length === 0), Nr(s, ["`" + n + "`", "is not a valid prop. You may have spelled it incorrectly, or if it's", "a plugin, forgot to pass it in an array as props.plugins.", `

`, `All props: https://atomiks.github.io/tippyjs/v6/all-props/
`, "Plugins: https://atomiks.github.io/tippyjs/v6/plugins/"].join(" "));
  });
}
var zO = function() {
  return "innerHTML";
};
function rd(A, e) {
  A[zO()] = e;
}
function $w(A) {
  var e = ps();
  return A === !0 ? e.className = B0 : (e.className = w0, _s(A) ? e.appendChild(A) : rd(e, A)), e;
}
function Gw(A, e) {
  _s(e.content) ? (rd(A, ""), A.appendChild(e.content)) : typeof e.content != "function" && (e.allowHTML ? rd(A, e.content) : A.textContent = e.content);
}
function id(A) {
  var e = A.firstElementChild, t = uc(e.children);
  return {
    box: e,
    content: t.find(function(n) {
      return n.classList.contains(g0);
    }),
    arrow: t.find(function(n) {
      return n.classList.contains(B0) || n.classList.contains(w0);
    }),
    backdrop: t.find(function(n) {
      return n.classList.contains(UO);
    })
  };
}
function b0(A) {
  var e = ps(), t = ps();
  t.className = FO, t.setAttribute("data-state", "hidden"), t.setAttribute("tabindex", "-1");
  var n = ps();
  n.className = g0, n.setAttribute("data-state", "hidden"), Gw(n, A.props), e.appendChild(t), t.appendChild(n), i(A.props, A.props);
  function i(s, l) {
    var f = id(e), c = f.box, h = f.content, w = f.arrow;
    l.theme ? c.setAttribute("data-theme", l.theme) : c.removeAttribute("data-theme"), typeof l.animation == "string" ? c.setAttribute("data-animation", l.animation) : c.removeAttribute("data-animation"), l.inertia ? c.setAttribute("data-inertia", "") : c.removeAttribute("data-inertia"), c.style.maxWidth = typeof l.maxWidth == "number" ? l.maxWidth + "px" : l.maxWidth, l.role ? c.setAttribute("role", l.role) : c.removeAttribute("role"), (s.content !== l.content || s.allowHTML !== l.allowHTML) && Gw(h, A.props), l.arrow ? w ? s.arrow !== l.arrow && (c.removeChild(w), c.appendChild($w(l.arrow))) : c.appendChild($w(l.arrow)) : w && c.removeChild(w);
  }
  return {
    popper: e,
    onUpdate: i
  };
}
b0.$$tippy = !0;
var JO = 1, ol = [], fh = [];
function jO(A, e) {
  var t = kw(A, Object.assign({}, on, F0(Nw(e)))), n, i, s, l = !1, f = !1, c = !1, h = !1, w, B, p, v = [], o = Dw(eA, t.interactiveDebounce), C, F = JO++, U = null, H = xO(t.plugins), D = {
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
  }, E = {
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
    setProps: Ut,
    setContent: gt,
    show: un,
    hide: dr,
    hideWithInteractivity: Qi,
    enable: Dt,
    disable: Ft,
    unmount: Gr,
    destroy: Vr
  };
  if (!t.render)
    return process.env.NODE_ENV !== "production" && nd(!0, "render() function has not been supplied."), E;
  var M = t.render(E), K = M.popper, J = M.onUpdate;
  K.setAttribute("data-tippy-root", ""), K.id = "tippy-" + E.id, E.popper = K, A._tippy = E, K._tippy = E;
  var hA = H.map(function(pA) {
    return pA.fn(E);
  }), cA = A.hasAttribute("aria-expanded");
  return X(), uA(), gA(), IA("onCreate", [E]), t.showOnCreate && Te(), K.addEventListener("mouseenter", function() {
    E.props.interactive && E.state.isVisible && E.clearDelayTimeouts();
  }), K.addEventListener("mouseleave", function() {
    E.props.interactive && E.props.trigger.indexOf("mouseenter") >= 0 && q().addEventListener("mousemove", o);
  }), E;
  function wA() {
    var pA = E.props.touch;
    return Array.isArray(pA) ? pA : [pA, 0];
  }
  function QA() {
    return wA()[0] === "hold";
  }
  function OA() {
    var pA;
    return !!((pA = E.props.render) != null && pA.$$tippy);
  }
  function EA() {
    return C || A;
  }
  function q() {
    var pA = EA().parentNode;
    return pA ? DO(pA) : document;
  }
  function CA() {
    return id(K);
  }
  function iA(pA) {
    return E.state.isMounted && !E.state.isVisible || ir.isTouch || w && w.type === "focus" ? 0 : uh(E.props.delay, pA ? 0 : 1, on.delay);
  }
  function gA(pA) {
    pA === void 0 && (pA = !1), K.style.pointerEvents = E.props.interactive && !pA ? "" : "none", K.style.zIndex = "" + E.props.zIndex;
  }
  function IA(pA, MA, XA) {
    if (XA === void 0 && (XA = !0), hA.forEach(function(Ce) {
      Ce[pA] && Ce[pA].apply(Ce, MA);
    }), XA) {
      var ye;
      (ye = E.props)[pA].apply(ye, MA);
    }
  }
  function HA() {
    var pA = E.props.aria;
    if (pA.content) {
      var MA = "aria-" + pA.content, XA = K.id, ye = Ra(E.props.triggerTarget || A);
      ye.forEach(function(Ce) {
        var at = Ce.getAttribute(MA);
        if (E.state.isVisible)
          Ce.setAttribute(MA, at ? at + " " + XA : XA);
        else {
          var bt = at && at.replace(XA, "").trim();
          bt ? Ce.setAttribute(MA, bt) : Ce.removeAttribute(MA);
        }
      });
    }
  }
  function uA() {
    if (!(cA || !E.props.aria.expanded)) {
      var pA = Ra(E.props.triggerTarget || A);
      pA.forEach(function(MA) {
        E.props.interactive ? MA.setAttribute("aria-expanded", E.state.isVisible && MA === EA() ? "true" : "false") : MA.removeAttribute("aria-expanded");
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
      if (!(E.props.interactive && Pw(K, MA))) {
        if (Ra(E.props.triggerTarget || A).some(function(XA) {
          return Pw(XA, MA);
        })) {
          if (ir.isTouch || E.state.isVisible && E.props.trigger.indexOf("click") >= 0)
            return;
        } else
          IA("onClickOutside", [E, pA]);
        E.props.hideOnClick === !0 && (E.clearDelayTimeouts(), E.hide(), f = !0, setTimeout(function() {
          f = !1;
        }), E.state.isMounted || aA());
      }
    }
  }
  function j() {
    c = !0;
  }
  function S() {
    c = !1;
  }
  function R() {
    var pA = q();
    pA.addEventListener("mousedown", rA, !0), pA.addEventListener("touchend", rA, Vi), pA.addEventListener("touchstart", S, Vi), pA.addEventListener("touchmove", j, Vi);
  }
  function aA() {
    var pA = q();
    pA.removeEventListener("mousedown", rA, !0), pA.removeEventListener("touchend", rA, Vi), pA.removeEventListener("touchstart", S, Vi), pA.removeEventListener("touchmove", j, Vi);
  }
  function bA(pA, MA) {
    zA(pA, function() {
      !E.state.isVisible && K.parentNode && K.parentNode.contains(K) && MA();
    });
  }
  function _A(pA, MA) {
    zA(pA, MA);
  }
  function zA(pA, MA) {
    var XA = CA().box;
    function ye(Ce) {
      Ce.target === XA && (ch(XA, "remove", ye), MA());
    }
    if (pA === 0)
      return MA();
    ch(XA, "remove", B), ch(XA, "add", ye), B = ye;
  }
  function JA(pA, MA, XA) {
    XA === void 0 && (XA = !1);
    var ye = Ra(E.props.triggerTarget || A);
    ye.forEach(function(Ce) {
      Ce.addEventListener(pA, MA, XA), v.push({
        node: Ce,
        eventType: pA,
        handler: MA,
        options: XA
      });
    });
  }
  function X() {
    QA() && (JA("touchstart", k, {
      passive: !0
    }), JA("touchend", lA, {
      passive: !0
    })), _O(E.props.trigger).forEach(function(pA) {
      if (pA !== "manual")
        switch (JA(pA, k), pA) {
          case "mouseenter":
            JA("mouseleave", lA);
            break;
          case "focus":
            JA(RO ? "focusout" : "blur", TA);
            break;
          case "focusin":
            JA("focusout", TA);
            break;
        }
    });
  }
  function V() {
    v.forEach(function(pA) {
      var MA = pA.node, XA = pA.eventType, ye = pA.handler, Ce = pA.options;
      MA.removeEventListener(XA, ye, Ce);
    }), v = [];
  }
  function k(pA) {
    var MA, XA = !1;
    if (!(!E.state.isEnabled || jA(pA) || f)) {
      var ye = ((MA = w) == null ? void 0 : MA.type) === "focus";
      w = pA, C = pA.currentTarget, uA(), !E.state.isVisible && SO(pA) && ol.forEach(function(Ce) {
        return Ce(pA);
      }), pA.type === "click" && (E.props.trigger.indexOf("mouseenter") < 0 || l) && E.props.hideOnClick !== !1 && E.state.isVisible ? XA = !0 : Te(pA), pA.type === "click" && (l = !XA), XA && !ye && ce(pA);
    }
  }
  function eA(pA) {
    var MA = pA.target, XA = EA().contains(MA) || K.contains(MA);
    if (!(pA.type === "mousemove" && XA)) {
      var ye = he().concat(K).map(function(Ce) {
        var at, bt = Ce._tippy, Un = (at = bt.popperInstance) == null ? void 0 : at.state;
        return Un ? {
          popperRect: Ce.getBoundingClientRect(),
          popperState: Un,
          props: t
        } : null;
      }).filter(Boolean);
      OO(ye, pA) && (T(), ce(pA));
    }
  }
  function lA(pA) {
    var MA = jA(pA) || E.props.trigger.indexOf("click") >= 0 && l;
    if (!MA) {
      if (E.props.interactive) {
        E.hideWithInteractivity(pA);
        return;
      }
      ce(pA);
    }
  }
  function TA(pA) {
    E.props.trigger.indexOf("focusin") < 0 && pA.target !== EA() || E.props.interactive && pA.relatedTarget && K.contains(pA.relatedTarget) || ce(pA);
  }
  function jA(pA) {
    return ir.isTouch ? QA() !== pA.type.indexOf("touch") >= 0 : !1;
  }
  function se() {
    xe();
    var pA = E.props, MA = pA.popperOptions, XA = pA.placement, ye = pA.offset, Ce = pA.getReferenceClientRect, at = pA.moveTransition, bt = OA() ? id(K).arrow : null, Un = Ce ? {
      getBoundingClientRect: Ce,
      contextElement: Ce.contextElement || EA()
    } : A, Fi = {
      name: "$$tippy",
      enabled: !0,
      phase: "beforeWrite",
      requires: ["computeStyles"],
      fn: function(Wr) {
        var ln = Wr.state;
        if (OA()) {
          var bi = CA(), Xr = bi.box;
          ["placement", "reference-hidden", "escaped"].forEach(function(pr) {
            pr === "placement" ? Xr.setAttribute("data-placement", ln.placement) : ln.attributes.popper["data-popper-" + pr] ? Xr.setAttribute("data-" + pr, "") : Xr.removeAttribute("data-" + pr);
          }), ln.attributes.popper = {};
        }
      }
    }, bn = [{
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
        adaptive: !at
      }
    }, Fi];
    OA() && bt && bn.push({
      name: "arrow",
      options: {
        element: bt,
        padding: 3
      }
    }), bn.push.apply(bn, (MA == null ? void 0 : MA.modifiers) || []), E.popperInstance = QO(Un, K, Object.assign({}, MA, {
      placement: XA,
      onFirstUpdate: p,
      modifiers: bn
    }));
  }
  function xe() {
    E.popperInstance && (E.popperInstance.destroy(), E.popperInstance = null);
  }
  function fe() {
    var pA = E.props.appendTo, MA, XA = EA();
    E.props.interactive && pA === m0 || pA === "parent" ? MA = XA.parentNode : MA = v0(pA, [XA]), MA.contains(K) || MA.appendChild(K), E.state.isMounted = !0, se(), process.env.NODE_ENV !== "production" && Nr(E.props.interactive && pA === on.appendTo && XA.nextElementSibling !== K, ["Interactive tippy element may not be accessible via keyboard", "navigation because it is not directly after the reference element", "in the DOM source order.", `

`, "Using a wrapper <div> or <span> tag around the reference element", "solves this by creating a new parentNode context.", `

`, "Specifying `appendTo: document.body` silences this warning, but it", "assumes you are using a focus management solution to handle", "keyboard navigation.", `

`, "See: https://atomiks.github.io/tippyjs/v6/accessibility/#interactivity"].join(" "));
  }
  function he() {
    return uc(K.querySelectorAll("[data-tippy-root]"));
  }
  function Te(pA) {
    E.clearDelayTimeouts(), pA && IA("onTrigger", [E, pA]), R();
    var MA = iA(!0), XA = wA(), ye = XA[0], Ce = XA[1];
    ir.isTouch && ye === "hold" && Ce && (MA = Ce), MA ? n = setTimeout(function() {
      E.show();
    }, MA) : E.show();
  }
  function ce(pA) {
    if (E.clearDelayTimeouts(), IA("onUntrigger", [E, pA]), !E.state.isVisible) {
      aA();
      return;
    }
    if (!(E.props.trigger.indexOf("mouseenter") >= 0 && E.props.trigger.indexOf("click") >= 0 && ["mouseleave", "mousemove"].indexOf(pA.type) >= 0 && l)) {
      var MA = iA(!1);
      MA ? i = setTimeout(function() {
        E.state.isVisible && E.hide();
      }, MA) : s = requestAnimationFrame(function() {
        E.hide();
      });
    }
  }
  function Dt() {
    E.state.isEnabled = !0;
  }
  function Ft() {
    E.hide(), E.state.isEnabled = !1;
  }
  function Ot() {
    clearTimeout(n), clearTimeout(i), cancelAnimationFrame(s);
  }
  function Ut(pA) {
    if (process.env.NODE_ENV !== "production" && Nr(E.state.isDestroyed, La("setProps")), !E.state.isDestroyed) {
      IA("onBeforeUpdate", [E, pA]), V();
      var MA = E.props, XA = kw(A, Object.assign({}, MA, Nw(pA), {
        ignoreAttributes: !0
      }));
      E.props = XA, X(), MA.interactiveDebounce !== XA.interactiveDebounce && (T(), o = Dw(eA, XA.interactiveDebounce)), MA.triggerTarget && !XA.triggerTarget ? Ra(MA.triggerTarget).forEach(function(ye) {
        ye.removeAttribute("aria-expanded");
      }) : XA.triggerTarget && A.removeAttribute("aria-expanded"), uA(), gA(), J && J(MA, XA), E.popperInstance && (se(), he().forEach(function(ye) {
        requestAnimationFrame(ye._tippy.popperInstance.forceUpdate);
      })), IA("onAfterUpdate", [E, pA]);
    }
  }
  function gt(pA) {
    E.setProps({
      content: pA
    });
  }
  function un() {
    process.env.NODE_ENV !== "production" && Nr(E.state.isDestroyed, La("show"));
    var pA = E.state.isVisible, MA = E.state.isDestroyed, XA = !E.state.isEnabled, ye = ir.isTouch && !E.props.touch, Ce = uh(E.props.duration, 0, on.duration);
    if (!(pA || MA || XA || ye) && !EA().hasAttribute("disabled") && (IA("onShow", [E], !1), E.props.onShow(E) !== !1)) {
      if (E.state.isVisible = !0, OA() && (K.style.visibility = "visible"), gA(), R(), E.state.isMounted || (K.style.transition = "none"), OA()) {
        var at = CA(), bt = at.box, Un = at.content;
        lh([bt, Un], 0);
      }
      p = function() {
        var bn;
        if (!(!E.state.isVisible || h)) {
          if (h = !0, K.offsetHeight, K.style.transition = E.props.moveTransition, OA() && E.props.animation) {
            var Ui = CA(), Wr = Ui.box, ln = Ui.content;
            lh([Wr, ln], Ce), Mw([Wr, ln], "visible");
          }
          HA(), uA(), Ow(fh, E), (bn = E.popperInstance) == null || bn.forceUpdate(), IA("onMount", [E]), E.props.animation && OA() && _A(Ce, function() {
            E.state.isShown = !0, IA("onShown", [E]);
          });
        }
      }, fe();
    }
  }
  function dr() {
    process.env.NODE_ENV !== "production" && Nr(E.state.isDestroyed, La("hide"));
    var pA = !E.state.isVisible, MA = E.state.isDestroyed, XA = !E.state.isEnabled, ye = uh(E.props.duration, 1, on.duration);
    if (!(pA || MA || XA) && (IA("onHide", [E], !1), E.props.onHide(E) !== !1)) {
      if (E.state.isVisible = !1, E.state.isShown = !1, h = !1, l = !1, OA() && (K.style.visibility = "hidden"), T(), aA(), gA(!0), OA()) {
        var Ce = CA(), at = Ce.box, bt = Ce.content;
        E.props.animation && (lh([at, bt], ye), Mw([at, bt], "hidden"));
      }
      HA(), uA(), E.props.animation ? OA() && bA(ye, E.unmount) : E.unmount();
    }
  }
  function Qi(pA) {
    process.env.NODE_ENV !== "production" && Nr(E.state.isDestroyed, La("hideWithInteractivity")), q().addEventListener("mousemove", o), Ow(ol, o), o(pA);
  }
  function Gr() {
    process.env.NODE_ENV !== "production" && Nr(E.state.isDestroyed, La("unmount")), E.state.isVisible && E.hide(), E.state.isMounted && (xe(), he().forEach(function(pA) {
      pA._tippy.unmount();
    }), K.parentNode && K.parentNode.removeChild(K), fh = fh.filter(function(pA) {
      return pA !== E;
    }), E.state.isMounted = !1, IA("onHidden", [E]));
  }
  function Vr() {
    process.env.NODE_ENV !== "production" && Nr(E.state.isDestroyed, La("destroy")), !E.state.isDestroyed && (E.clearDelayTimeouts(), E.unmount(), V(), delete A._tippy, E.state.isDestroyed = !0, IA("onDestroy", [E]));
  }
}
function Ks(A, e) {
  e === void 0 && (e = {});
  var t = on.plugins.concat(e.plugins || []);
  process.env.NODE_ENV !== "production" && (GO(A), U0(e, t)), PO();
  var n = Object.assign({}, e, {
    plugins: t
  }), i = TO(A);
  if (process.env.NODE_ENV !== "production") {
    var s = _s(n.content), l = i.length > 1;
    Nr(s && l, ["tippy() was passed an Element as the `content` prop, but more than", "one tippy instance was created by this invocation. This means the", "content element will only be appended to the last tippy instance.", `

`, "Instead, pass the .innerHTML of the element, or use a function that", "returns a cloned version of the element instead.", `

`, `1) content: element.innerHTML
`, "2) content: () => element.cloneNode(true)"].join(" "));
  }
  var f = i.reduce(function(c, h) {
    var w = h && jO(h, n);
    return w && c.push(w), c;
  }, []);
  return _s(A) ? f[0] : f;
}
Ks.defaultProps = on;
Ks.setDefaultProps = XO;
Ks.currentInput = ir;
Object.assign({}, s0, {
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
  render: b0
});
const YO = "_btn_pqsxd_1", ZO = "_btnGroup_pqsxd_4", sl = {
  btn: YO,
  btnGroup: ZO
}, A4 = function(A) {
  var e = {
    onAnnotationSelectFunction: ae.noop(),
    drawing: null,
    popoverId: ""
  }, t = _e.merge({}, e, A), n = {
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
        var D = WA(this);
        i(D, H);
      }), t.onAnnotationSelectFunction();
    });
    var o = p.enter(), C = o.append("p");
    C.append("span").classed("genelabel", !0), C.append("div").classed("btn-group", !0), p.each(function(F) {
      var U = WA(this), H = U.select("div.btn-group");
      H.selectAll("a").data(["show", "hide", "auto"]).enter().append("a").attr("href", "#").text(function(E) {
        return E;
      }).classed(`${sl.btn}`, !0).on("click", function(E) {
        var M = n[E];
        M(F), t.onAnnotationSelectFunction(), i(U, F);
      });
    }), p.each(function(F) {
      var U = WA(this);
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
    WA(t.popoverId).attr("class", "popover");
    let B = WA(t.popoverId).select(".popover-title"), p = WA(t.popoverId).select(".popover-content");
    B.selectAll("*").remove(), B.text(""), p.selectAll("*").remove(), p.text(""), w ? s(B, p, c) : l(B, p, c);
    var v = h.target;
    ae(".gene-annotation-popover").remove(), Ks(v, {
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
      onShow(o) {
      },
      onHide(o) {
      }
    }), v._tippy.show(), ae(document).on("click", function(o) {
      ae(o.target).closest(
        '.gene-annotation-popover, [data-toggle="popover"]'
      ).length || ae(".gene-annotation-popover").remove();
    }), ae(t.popoverId).on("mousedown mousewheel", function(o) {
      o.stopPropagation();
    });
  }, f;
}, e4 = function(A) {
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
  }, t = _e.merge({}, e, A), n = null, i = function() {
    return oa().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, s = function(c, h) {
    _e.pick(t, ["onAnnotationSelectFunction", "drawing"]), t.popoverId = "#clusterPopover", n = A4(t);
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
      var w = WA(this).selectAll(".gene-annotations").data([h]);
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
}, t4 = function(A) {
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
  }, t = _e.merge({}, e, A), n = function() {
    return oa().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, i = function(h, w, B, p) {
    var v = {};
    p.map(function(M, K) {
      v[M] = K;
    });
    var o = n(), C = h.selectAll("rect.snp-annotation").data(B, function(M) {
      return M.id;
    }), F = 4, U = function(M) {
      return t.layout.width - 0.2 * t.layout.chromosomeWidth * (1 + v[M.trait]);
    }, H = function(M) {
      return o(M.midpoint) - 0.5 * Math.max(F / t.scale, o(10));
    }, D = Math.max(F / t.scale, o(10)), E = 0.2 * t.layout.chromosomeWidth;
    C.attr("x", U).attr("y", H).attr("width", E).attr("height", D), C.enter().append("rect").attr("fill", function(M) {
      return M.color;
    }).attr("opacity", function(M) {
      return M.importance;
    }).attr("class", "snp-annotation").attr("x", U).attr("y", H).attr("width", E).attr("height", D), C.exit().remove(), C.on("contextmenu", function(M) {
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
    }, E = h.selectAll("g.qtl-annotation").data(w.layout.qtlNodes, function(T) {
      return T.id;
    }), M = E.enter().append("g").classed("qtl-annotation infobox", !0);
    M.append("rect").classed("qtl-hoverbox", !0);
    var K = M.append("rect").classed("qtl-selector infobox", !0), J = {}, hA = {};
    E.exit().select("rect").each(function(T) {
      J[T.index] = _e.pick(this, ["x", "y", "width", "height"]), J[T.index].midpoint = T.midpoint, J[T.index].position = T.position;
    }), K.each(function(T) {
      hA[T.index] = _e.pick(this, ["x", "y", "width", "height"]), hA[T.index].midpoint = T.midpoint, hA[T.index].position = T.position;
    });
    var cA = function(T, rA, j, S) {
      return _e.has(T, rA) ? T[rA][j].animVal.value : S;
    };
    K.attr("x", function(T) {
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
    }), E.attr("id", function(T) {
      return "feature_" + T.id;
    }), E.select("rect.qtl-hoverbox").attr("x", function(T) {
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
    }), E.select("rect.qtl-selector").transition().duration(p).attr("x", D).attr("y", function(T) {
      return v(T.start);
    }).attr("width", o).attr("height", function(T) {
      return v(T.end) - v(T.start);
    }), E.select("rect.qtl-selector").style("fill", function(T) {
      return T.color;
    }), E.exit().select("rect").transition().duration(p).attr("x", function(T) {
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
    }).remove(), E.exit().remove();
    var wA = function(T) {
      return v(T.midpoint);
    }, QA = function(T) {
      return T.displayLabel === "show" ? "visible" : T.displayLabel === "hide" ? "hidden" : !0;
    }, OA = M.append("g").classed("qtl-count-group", !0), EA = E.select("g.qtl-count-group").selectAll("g.qtllist").data(
      function(T) {
        var rA = T.type == "qtllist" ? [T] : [];
        return rA;
      },
      function(T) {
        return "label_" + T.id;
      }
    ), q = EA.enter(), CA = q.append("g").classed("qtllist", !0);
    CA.append("circle").classed("qtl-count", !0), CA.append("text").classed("qtl-count", !0), OA.each(function(T) {
      if (_e.has(hA, T.index))
        if (_e.has(J, T.parentIndex)) {
          let S = J[T.parentIndex];
          var rA = t.layout.width - S.position * (C + o), j = v(S.midpoint);
          WA(this).attr(
            "transform",
            "translate(" + (rA + 0.5 * o) + "," + j + ")"
          );
        } else
          WA(this).attr("transform", function(S) {
            return S ? "translate(" + (D(S) + 0.5 * o) + "," + wA(S) + ")" : "translate(0,0)";
          });
    }), E.select("g.qtl-count-group").transition().duration(p).attr("transform", function(T) {
      return T ? "translate(" + (D(T) + 0.5 * o) + "," + wA(T) + ")" : "translate(0,0)";
    }), E.select("circle.qtl-count").attr("cx", 0).attr("cy", 0).attr("r", o + "px").style("visibility", "visible").style("fill", function(T) {
      return T.color;
    }).attr("id", function(T) {
      return T.id;
    });
    var iA = Math.min(
      Math.max(10 / t.scale, o),
      14 / t.scale
    );
    E.select("text.qtl-count").attr("x", 0).attr("y", 0).attr("dy", "0.3em").attr("text-anchor", "middle").style("fill", "white").style("font-size", iA + "px").style(
      "visibility",
      iA < 2 * o ? "visible" : "hidden"
    ).text(function(T) {
      return T.count;
    }), EA.exit().remove(), M.append("g").classed("qtl-label-group", !0);
    var gA = E.select("g.qtl-label-group").selectAll("g.qtl").data(
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
    HA.append("text").classed("qtl-label", !0), E.select("text.qtl-label").attr("x", 0).attr("y", 0).attr("dy", "0.3em").attr("text-anchor", "middle").style("font-size", function(T) {
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
    uA(E.select("rect.qtl-selector")), uA(E.select("circle.qtl-count")), uA(E.select("text.qtl-count")), E.on("contextmenu", function(T) {
      var rA = WA("#clusterPopover");
      rA.attr("class", "popover");
      var j = rA.select(".popover-title");
      j.selectAll("*").remove(), j.text(""), j.text(
        "Chromosome " + T.chromosome + ": " + T.start + "-" + T.end
      ), ae.fn.redraw = function() {
        return ae(this).each(function() {
          this.offsetHeight;
        });
      }, S = rA.select(".popover-content"), S.selectAll("*").remove(), S.text("");
      var S = rA.select(".popover-content").selectAll("p").data(
        //Either bind a single qtl or a list of qtls
        T.type == "qtllist" ? T.qtlList : [T]
      ), R = S.enter();
      R.append("p").classed("popover-annotation", !0);
      var aA = S.append("div").attr("class", "checkbox").append("label");
      aA.append("input").attr("type", "checkbox").attr("value", "").property("checked", function(bA) {
        return bA.selected;
      }).on("click", function(bA) {
        bA.selected = !bA.selected, S.classed("selected", function(_A) {
          return _A.selected;
        }), t.onAnnotationSelectFunction();
      }), aA.append("a").attr("href", function(bA) {
        return bA.link;
      }).attr("target", "_blank").text(function(bA) {
        return bA.label;
      }), S.classed("selected", function(bA) {
        return bA.selected;
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
      }), p = f(B), v = WA(this).selectAll(".qtl-annotations").data([w]);
      v.enter().append("g").attr("class", "qtl-annotations"), v.attr(
        "transform",
        "translate(" + t.layout.x + "," + t.layout.y + ")"
      ), s(v, w, p.length), t.border && l(v), v.exit().remove();
      var o = WA(this).selectAll(".snp-annotations").data([w]);
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
}, n4 = function(A) {
  var e = {
    border: !1,
    onAnnotationSelectFunction: ae.noop(),
    onExpandClusterFunction: ae.noop(),
    onLabelSelectFunction: ae.noop(),
    maxAnnotationLayers: 3,
    maxSnpPValue: 1,
    svg: null
  }, t = _e.merge({}, e, A);
  function n(i) {
    i.each(function(s) {
      var l = s.cellLayout, f = WA(this).selectAll(".chromosome-cell").data(s.chromosomes), c = f.enter().append("g").attr("class", "chromosome-cell");
      t.border && c.append("rect").classed("border", !0), WA(this).selectAll(".chromosome-cell").attr("transform", function(v) {
        return "translate(" + v.cell.x + "," + v.cell.y + ")";
      }), t.border && f.select("rect").attr("x", 0).attr("y", 0).attr("width", function(v) {
        return v.cell.width;
      }).attr("height", function(v) {
        return v.cell.height;
      });
      var h = e4().onAnnotationSelectFunction(t.onAnnotationSelectFunction).onExpandClusterFunction(t.onExpandClusterFunction).layout(l.geneAnnotationPosition).longestChromosome(l.longestChromosome).chromosomeWidth(l.chromosomePosition.width).annotationLabelSize(l.annotations.label.size).annotationMarkerSize(l.annotations.marker.size).drawing(t.svg).scale(l.scale);
      Wh(".chromosome-cell").call(h);
      var w = wD().layout(l.chromosomePosition).longestChromosome(l.longestChromosome).onAnnotationSelectFunction(t.onAnnotationSelectFunction).scale(l.scale).bands("genes").drawing(t.svg);
      Wh(".chromosome-cell").call(w);
      var B = BD().layout(l.labelPosition).sizeLayout(l.sizeLabelPosition).onLabelSelectFunction(t.onLabelSelectFunction).longestChromosome(l.longestChromosome).scale(l.scale);
      f.call(B);
      var p = t4().onAnnotationSelectFunction(t.onAnnotationSelectFunction).layout(l.qtlAnnotationPosition).longestChromosome(l.longestChromosome).chromosomeWidth(l.chromosomePosition.width).annotationLabelSize(l.annotations.label.size).annotationMarkerSize(l.annotations.marker.size).showAnnotationLabels(l.annotations.label.show).maxSnpPValue(t.maxSnpPValue).drawing(t.svg).scale(l.scale);
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
var E0 = { exports: {} };
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
            for (var D = F, E = H - 1; E >= 0; E--) D = D.createStub(h.stubWidth), o[E].push(D);
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
          for (var E = v.length - 1; E >= 1; E--) for (var M = v[E], K = 0; K < M.length; K++) {
            var J = M[K];
            if (!J.isStub()) for (var hA = J, cA = E - 1; cA >= 0; cA--) hA = hA.createStub(h.stubWidth), v[cA].push(hA);
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
          for (var E = H.length - 1; D <= E && H[D][0] <= v; ) D++;
          H.slice(U + 1, D).forEach(function(M) {
            var K = M[1];
            C[K] = !0;
          }, this), Object.keys(C).forEach(function(M) {
            var K = this.intervalHash[M];
            o.push(K.result(p, v));
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
          B = f.extend(h, B), w.forEach(function(K, J) {
            K.targetPos = K.parent ? K.parent.currentPos : K.idealPos, K.index = J;
          });
          for (var p = w.concat().sort(function(K, J) {
            var hA = K.targetPos - J.targetPos;
            if (hA !== 0) return hA;
            var cA = K.isStub() - J.isStub();
            return cA !== 0 ? cA : K.index - J.index;
          }).map(s), v = [], o = 1; o < p.length; o++) {
            var C = p[o - 1], F = p[o], U = void 0;
            U = C.node.isStub() && F.node.isStub() ? (C.node.width + F.node.width) / 2 + B.lineSpacing : (C.node.width + F.node.width) / 2 + B.nodeSpacing, v.push(new c.Constraint(C, F, U));
          }
          if (f.isDefined(B.minPos)) {
            var H = new c.Variable(B.minPos, 1e10), D = p[0];
            v.push(new c.Constraint(H, D, D.node.width / 2)), p.unshift(H);
          }
          if (f.isDefined(B.maxPos)) {
            var E = new c.Variable(B.maxPos, 1e10), M = f.last(p);
            v.push(new c.Constraint(M, E, M.node.width / 2)), p.push(E);
          }
          new c.Solver(p, v).solve(), p.filter(function(K) {
            return K.node;
          }).map(function(K) {
            return K.node.currentPos = Math.round(K.position()), K;
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
})(E0);
var _0 = E0.exports;
const x0 = /* @__PURE__ */ vc(_0), r4 = /* @__PURE__ */ HE({
  __proto__: null,
  default: x0
}, [_0]);
function i4(A) {
  return A.slice().sort(function(e, t) {
    return e - t;
  });
}
function Vw(A, e) {
  for (var t = [], n = 0; n < A; n++) {
    for (var i = [], s = 0; s < e; s++)
      i.push(0);
    t.push(i);
  }
  return t;
}
function a4(A) {
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
function o4(A, e, t) {
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
function s4(A, e) {
  if (e > A.length)
    throw new Error(
      "cannot generate more classes than there are data values"
    );
  var t = i4(A), n = a4(t);
  if (n === 1)
    return [t];
  var i = Vw(e, t.length), s = Vw(e, t.length);
  o4(t, i, s);
  for (var l = [], f = s[0].length - 1, c = s.length - 1; c >= 0; c--) {
    var h = s[c][f];
    l[c] = t.slice(h, f + 1), c > 0 && (f = h - 1);
  }
  return l;
}
const Ww = function(A) {
  var e = {}, t = { nClusters: 6 }, n = _e.merge({}, t, A);
  return e.createClustersFromGenes = function(i) {
    var s = [];
    if (i.length < 1)
      return s;
    var l = Math.min(n.nClusters, i.length), f = i.map(function(B) {
      return B.midpoint;
    });
    let c = s4(f, l);
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
var hh = x0 || r4;
const u4 = function(A) {
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
  }, t = _e.merge({}, e, A), n = function() {
    return oa().range([0, t.layout.height]).domain([0, t.longestChromosome]);
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
    var E = n();
    let M = {
      nodeSpacing: D.nodeSpacing,
      lineSpacing: D.lineSpacing,
      algorithm: "overlap",
      minPos: 0,
      maxPos: D.availableHeight,
      density: D.density
    };
    var K = new hh.Force(M);
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
    var hA = Array.from(J), cA = f(K, E, D, hA);
    !cA == 0 && (K.options({ algorithm: "simple" }), cA = f(K, E, D, hA));
    var wA;
    if (cA && cA.length > 0) {
      var QA = cA.map(function(iA) {
        return iA.getLayerIndex();
      });
      wA = Math.max.apply(null, QA);
    }
    if (!cA || wA > 3) {
      var OA = Ww().nClusters(Math.max(D.nLabels, 1));
      try {
        var EA = OA.createClustersFromGenes(hA);
      } catch {
        EA = [];
      }
      cA = f(K, E, D, EA);
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
    var p = Ww(), v = B.annotations.genes, o = p.createClustersFromGenes(v);
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
}, l4 = function(A) {
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
  }, t = _e.merge({}, e, A), n = function() {
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
}, c4 = function(A) {
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
  }, t = _e.merge({}, e, A), n, i = function() {
    ae(this).hasClass("disabled") || t.onNetworkBtnClick();
  }, s = function() {
    ae(this).hasClass("disabled") || t.onTagBtnClick();
  }, l = function() {
    ae(this).hasClass("disabled") || t.onFitBtnClick();
  }, f = function() {
    if (ae(this).hasClass("disabled"))
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
    D && (D.innerHTML = "", o.forEach(function(E) {
      var M = document.createElement("option");
      M.value = E[1], M.textContent = E[0], E[1] === F && (M.selected = !0), D.appendChild(M);
    }), D.addEventListener("change", function() {
      var E = D.options[D.selectedIndex], M = E.value;
      C(M);
    }));
  }, w = function() {
    var p = WA(n).selectAll(".genemap-menu").data([null]);
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
      ae("#select-ngenes-dropdown").selectpicker("val", [
        wA + " genes",
        wA
      ]);
    }), p.select(".export-btn").attr("title", "Export to PNG").on("click", t.onExportBtnClick), p.select(".expand-btn").attr("title", "Toggle full screen").on("click", c);
    var U = "https://github.com/francis-newson-tessella/QTLNetMiner/tree/QTLNM-47-MVE/common/client/src/main/webapp/html/GeneMap/docs";
    p.select(".help-btn").attr("title", "help").text("Help").on("click", function() {
      window.open(U, "_blank");
    });
    var H = WA(n).selectAll(".genemap-advanced-menu").data([null]), D = H.select(".popover-content").selectAll("div").data([
      "qtl-btn",
      "nperrow-spinner",
      "max-snp-pvalue",
      "labelsize",
      "export-all-btn"
    ]);
    D.enter().append("div").attr("class", function(wA) {
      return wA;
    });
    var E = H.select(".qtl-btn");
    h(
      E,
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
    K.append("label").attr("id", "max-snp-pvalue-label").attr("for", "max-snp-pvalue-input").html("Max SNP p-value:&nbsp"), K.append("input").attr("class", "form-control").attr("id", "max-snp-pvalue-input").attr("type", "text").attr("value", t.maxSnpPValueProperty()), K.append("button").attr("type", "submit").attr("class", "btn btn-default").text("Set"), ae("#snp-pvalue-form").submit(function(wA) {
      t.maxSnpPValueProperty(ae("#max-snp-pvalue-input").val()), wA.preventDefault();
    }), t.maxSnpPValueProperty.addListener(function(wA) {
      ae("#max-snp-pvalue-input").val(wA);
    });
    var J = H.select(".nperrow-spinner"), hA = J.selectAll("input").data(["nPerRowSpinner"]).enter();
    hA.append("span").append("label").classed("bootstrap", !0).attr("for", (wA) => wA).html("Num per row:&nbsp;"), hA.append("span").append("input").attr("id", (wA) => wA).attr("type", "text").attr("value", t.initialNPerRow).attr("name", (wA) => wA), WA(".nperrow-spinner").select(".input-group").style("width", "8em").style("display", "inline-table"), ae("#nPerRowSpinner").on("change", function(wA) {
      t.onSetNumberPerRowClick(ae("#nPerRowSpinner").val());
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
      ae("#select-labelsize-dropdown").selectpicker("val", [
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
    var v = WA(n).select(".tag-btn");
    p === "show" ? (v.classed("show-label", !0), v.classed("hide-label", !1), v.classed("auto-label", !1), v.classed("manual-label", !1), v.attr("title", "Show Labels")) : p === "hide" ? (v.classed("show-label", !1), v.classed("hide-label", !0), v.classed("auto-label", !1), v.classed("manual-label", !1), v.attr("title", "Hide Labels")) : p === "manual" ? (v.classed("show-label", !1), v.classed("hide-label", !1), v.classed("auto-label", !1), v.classed("manual-label", !0), v.attr("title", "Manual Labels")) : (v.classed("show-label", !1), v.classed("hide-label", !1), v.classed("auto-label", !0), v.classed("manual-label", !1), v.attr("title", "Automatic Labels"));
  }, B.getTagButtonState = function() {
    var p = WA(n).select(".tag-btn");
    return p.classed("show-label") ? "show" : p.classed("hide-label") ? "hide" : p.classed("auto-label") ? "auto" : "manual";
  }, B.setFitButtonEnabled = function(p) {
    WA(n).select(".fit-btn").classed("disabled", !p);
  }, B.setNetworkButtonEnabled = function(p) {
    WA(n).select(".network-btn").classed("disabled", !p);
  }, B;
};
class f4 {
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
function h4(A, e, t, n, i, s) {
  return t = t || "average", new f4(
    e,
    t,
    n
  ).cluster(A, i, s);
}
const d4 = function() {
  var A = {};
  return A.positionAnnotations = function(e, t, n, i, s, l) {
    for (var f = i, c = l, h = s, w = function(M, K) {
      return f(M) < c(K) && f(K) < c(M);
    }, B = e.sort(function(M, K) {
      return h(M) - h(K);
    }), p = [], v = 0; v < B.length; v++) {
      for (var o = e[v], C = [], F = 0; F < p.length; F++) {
        var U = B[p[F]];
        w(o, U) || C.push(p[F]);
      }
      var H = _e.difference(p, C), D = H.map(function(M) {
        return t(B[M]);
      }), E = 0;
      for (E = 1; E < D.length + 1 && D.indexOf(E) !== -1; E++)
        ;
      n(o, E), p.push(v);
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
}, p4 = function(A) {
  var e = {
    scale: 1,
    longestChromosome: 1e3,
    showAllQTLs: !0,
    showSelectedQTLs: !0,
    showAutoQTLLabels: !0,
    showSelectedQTLLabels: !0,
    annotationLabelSize: 5
  }, t = _e.merge({}, e, A), n = d4(), i = function() {
    return oa().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, s = function(o) {
    return o.map(function(C) {
      var F = p(C), U = F.reduce(function(K, J) {
        return Math.min(K, J.start);
      }, 1 / 0), H = F.reduce(function(K, J) {
        return Math.max(K, J.end);
      }, 0), D = F.reduce(function(K, J) {
        return K + (K ? "|" : "") + J.start + "-" + J.end;
      }, ""), E = (U + H) / 2;
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
        midpoint: E,
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
        var D = C.reduce(function(E, M) {
          return Math.max(E, M.position);
        }, 0);
        if (D < 2) {
          if (F = B(F), H == F.length)
            break;
          H = F.length;
        } else
          break;
      }
    } else t.showSelectedQTLs && (o.layout.qtlDisplayClusters = o.annotations.qtls.filter(
      function(E) {
        return E.selected;
      }
    ), F = o.layout.qtlDisplayClusters, C = F.map(function(E) {
      let M = E;
      return M.type = "qtl", M;
    }));
    return C;
  }, f = function(o) {
    var C = _e.groupBy(o, "position");
    return _e.forOwn(C, function(F) {
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
      var H = 14 / t.scale, D = H > 0.6 * t.layout.chromosomeWidth, E = U > 3;
      !E && !D ? (f(F), F.forEach(function(J) {
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
      var K = 0.3 * t.layout.chromosomeWidth;
      M.forEach(function(J) {
        J.displayLabel = !0, J.screenLabel = J.label, J.fontSize = Math.min(H, 2 * K);
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
    var C = h4(
      o.annotations.qtls,
      function(U, H) {
        if (U.end == H.end && U.start == H.start)
          return 0;
        var D = Math.min(U.end, H.end) - Math.max(U.start, H.start), E = U.end - U.start, M = H.end - H.start, K = D, J = Math.abs(E - M);
        return Math.max(0.1, J - K);
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
function Lt(A, e) {
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
}, g4 = function(A) {
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
}, it = function() {
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
}, Xw = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", B4 = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var ll = 0; ll < Xw.length; ll++)
  B4[Xw.charCodeAt(ll)] = ll;
var qw = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", ts = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var cl = 0; cl < qw.length; cl++)
  ts[qw.charCodeAt(cl)] = cl;
var w4 = function(A) {
  var e = A.length * 0.75, t = A.length, n, i = 0, s, l, f, c;
  A[A.length - 1] === "=" && (e--, A[A.length - 2] === "=" && e--);
  var h = typeof ArrayBuffer < "u" && typeof Uint8Array < "u" && typeof Uint8Array.prototype.slice < "u" ? new ArrayBuffer(e) : new Array(e), w = Array.isArray(h) ? h : new Uint8Array(h);
  for (n = 0; n < t; n += 4)
    s = ts[A.charCodeAt(n)], l = ts[A.charCodeAt(n + 1)], f = ts[A.charCodeAt(n + 2)], c = ts[A.charCodeAt(n + 3)], w[i++] = s << 2 | l >> 4, w[i++] = (l & 15) << 4 | f >> 2, w[i++] = (f & 3) << 6 | c & 63;
  return h;
}, m4 = function(A) {
  for (var e = A.length, t = [], n = 0; n < e; n += 2)
    t.push(A[n + 1] << 8 | A[n]);
  return t;
}, v4 = function(A) {
  for (var e = A.length, t = [], n = 0; n < e; n += 4)
    t.push(A[n + 3] << 24 | A[n + 2] << 16 | A[n + 1] << 8 | A[n]);
  return t;
}, Aa = 5, Pp = 11, dh = 2, y4 = Pp - Aa, I0 = 65536 >> Aa, C4 = 1 << Aa, ph = C4 - 1, Q4 = 1024 >> Aa, F4 = I0 + Q4, U4 = F4, b4 = 32, E4 = U4 + b4, _4 = 65536 >> Pp, x4 = 1 << y4, I4 = x4 - 1, zw = function(A, e, t) {
  return A.slice ? A.slice(e, t) : new Uint16Array(Array.prototype.slice.call(A, e, t));
}, H4 = function(A, e, t) {
  return A.slice ? A.slice(e, t) : new Uint32Array(Array.prototype.slice.call(A, e, t));
}, S4 = function(A, e) {
  var t = w4(A), n = Array.isArray(t) ? v4(t) : new Uint32Array(t), i = Array.isArray(t) ? m4(t) : new Uint16Array(t), s = 24, l = zw(i, s / 2, n[4] / 2), f = n[5] === 2 ? zw(i, (s + n[4]) / 2) : H4(n, Math.ceil((s + n[4]) / 4));
  return new L4(n[0], n[1], n[2], n[3], l, f);
}, L4 = (
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
          return t = this.index[I0 + (e - 55296 >> Aa)], t = (t << dh) + (e & ph), this.data[t];
        if (e < this.highStart)
          return t = E4 - _4 + (e >> Pp), t = this.index[t], t += e >> Aa & I4, t = this.index[t], t = (t << dh) + (e & ph), this.data[t];
        if (e <= 1114111)
          return this.data[this.highValueIndex];
      }
      return this.errorValue;
    }, A;
  }()
), Jw = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", T4 = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var fl = 0; fl < Jw.length; fl++)
  T4[Jw.charCodeAt(fl)] = fl;
var D4 = "KwAAAAAAAAAACA4AUD0AADAgAAACAAAAAAAIABAAGABAAEgAUABYAGAAaABgAGgAYgBqAF8AZwBgAGgAcQB5AHUAfQCFAI0AlQCdAKIAqgCyALoAYABoAGAAaABgAGgAwgDKAGAAaADGAM4A0wDbAOEA6QDxAPkAAQEJAQ8BFwF1AH0AHAEkASwBNAE6AUIBQQFJAVEBWQFhAWgBcAF4ATAAgAGGAY4BlQGXAZ8BpwGvAbUBvQHFAc0B0wHbAeMB6wHxAfkBAQIJAvEBEQIZAiECKQIxAjgCQAJGAk4CVgJeAmQCbAJ0AnwCgQKJApECmQKgAqgCsAK4ArwCxAIwAMwC0wLbAjAA4wLrAvMC+AIAAwcDDwMwABcDHQMlAy0DNQN1AD0DQQNJA0kDSQNRA1EDVwNZA1kDdQB1AGEDdQBpA20DdQN1AHsDdQCBA4kDkQN1AHUAmQOhA3UAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AKYDrgN1AHUAtgO+A8YDzgPWAxcD3gPjA+sD8wN1AHUA+wMDBAkEdQANBBUEHQQlBCoEFwMyBDgEYABABBcDSARQBFgEYARoBDAAcAQzAXgEgASIBJAEdQCXBHUAnwSnBK4EtgS6BMIEyAR1AHUAdQB1AHUAdQCVANAEYABgAGAAYABgAGAAYABgANgEYADcBOQEYADsBPQE/AQEBQwFFAUcBSQFLAU0BWQEPAVEBUsFUwVbBWAAYgVgAGoFcgV6BYIFigWRBWAAmQWfBaYFYABgAGAAYABgAKoFYACxBbAFuQW6BcEFwQXHBcEFwQXPBdMF2wXjBeoF8gX6BQIGCgYSBhoGIgYqBjIGOgZgAD4GRgZMBmAAUwZaBmAAYABgAGAAYABgAGAAYABgAGAAYABgAGIGYABpBnAGYABgAGAAYABgAGAAYABgAGAAYAB4Bn8GhQZgAGAAYAB1AHcDFQSLBmAAYABgAJMGdQA9A3UAmwajBqsGqwaVALMGuwbDBjAAywbSBtIG1QbSBtIG0gbSBtIG0gbdBuMG6wbzBvsGAwcLBxMHAwcbByMHJwcsBywHMQcsB9IGOAdAB0gHTgfSBkgHVgfSBtIG0gbSBtIG0gbSBtIG0gbSBiwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdgAGAALAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdbB2MHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB2kH0gZwB64EdQB1AHUAdQB1AHUAdQB1AHUHfQdgAIUHjQd1AHUAlQedB2AAYAClB6sHYACzB7YHvgfGB3UAzgfWBzMB3gfmB1EB7gf1B/0HlQENAQUIDQh1ABUIHQglCBcDLQg1CD0IRQhNCEEDUwh1AHUAdQBbCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIcAh3CHoIMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIgggwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAALAcsBywHLAcsBywHLAcsBywHLAcsB4oILAcsB44I0gaWCJ4Ipgh1AHUAqgiyCHUAdQB1AHUAdQB1AHUAdQB1AHUAtwh8AXUAvwh1AMUIyQjRCNkI4AjoCHUAdQB1AO4I9gj+CAYJDgkTCS0HGwkjCYIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiAAIAAAAFAAYABgAGIAXwBgAHEAdQBFAJUAogCyAKAAYABgAEIA4ABGANMA4QDxAMEBDwE1AFwBLAE6AQEBUQF4QkhCmEKoQrhCgAHIQsAB0MLAAcABwAHAAeDC6ABoAHDCwMMAAcABwAHAAdDDGMMAAcAB6MM4wwjDWMNow3jDaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAEjDqABWw6bDqABpg6gAaABoAHcDvwOPA+gAaABfA/8DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DpcPAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcAB9cPKwkyCToJMAB1AHUAdQBCCUoJTQl1AFUJXAljCWcJawkwADAAMAAwAHMJdQB2CX4JdQCECYoJjgmWCXUAngkwAGAAYABxAHUApgn3A64JtAl1ALkJdQDACTAAMAAwADAAdQB1AHUAdQB1AHUAdQB1AHUAowYNBMUIMAAwADAAMADICcsJ0wnZCRUE4QkwAOkJ8An4CTAAMAB1AAAKvwh1AAgKDwoXCh8KdQAwACcKLgp1ADYKqAmICT4KRgowADAAdQB1AE4KMAB1AFYKdQBeCnUAZQowADAAMAAwADAAMAAwADAAMAAVBHUAbQowADAAdQC5CXUKMAAwAHwBxAijBogEMgF9CoQKiASMCpQKmgqIBKIKqgquCogEDQG2Cr4KxgrLCjAAMADTCtsKCgHjCusK8Qr5CgELMAAwADAAMAB1AIsECQsRC3UANAEZCzAAMAAwADAAMAB1ACELKQswAHUANAExCzkLdQBBC0kLMABRC1kLMAAwADAAMAAwADAAdQBhCzAAMAAwAGAAYABpC3ELdwt/CzAAMACHC4sLkwubC58Lpwt1AK4Ltgt1APsDMAAwADAAMAAwADAAMAAwAL4LwwvLC9IL1wvdCzAAMADlC+kL8Qv5C/8LSQswADAAMAAwADAAMAAwADAAMAAHDDAAMAAwADAAMAAODBYMHgx1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1ACYMMAAwADAAdQB1AHUALgx1AHUAdQB1AHUAdQA2DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AD4MdQBGDHUAdQB1AHUAdQB1AEkMdQB1AHUAdQB1AFAMMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQBYDHUAdQB1AF8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUA+wMVBGcMMAAwAHwBbwx1AHcMfwyHDI8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAYABgAJcMMAAwADAAdQB1AJ8MlQClDDAAMACtDCwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB7UMLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AA0EMAC9DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAsBywHLAcsBywHLAcsBywHLQcwAMEMyAwsBywHLAcsBywHLAcsBywHLAcsBywHzAwwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1ANQM2QzhDDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMABgAGAAYABgAGAAYABgAOkMYADxDGAA+AwADQYNYABhCWAAYAAODTAAMAAwADAAFg1gAGAAHg37AzAAMAAwADAAYABgACYNYAAsDTQNPA1gAEMNPg1LDWAAYABgAGAAYABgAGAAYABgAGAAUg1aDYsGVglhDV0NcQBnDW0NdQ15DWAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAlQCBDZUAiA2PDZcNMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAnw2nDTAAMAAwADAAMAAwAHUArw23DTAAMAAwADAAMAAwADAAMAAwADAAMAB1AL8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQDHDTAAYABgAM8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA1w11ANwNMAAwAD0B5A0wADAAMAAwADAAMADsDfQN/A0EDgwOFA4wABsOMAAwADAAMAAwADAAMAAwANIG0gbSBtIG0gbSBtIG0gYjDigOwQUuDsEFMw7SBjoO0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGQg5KDlIOVg7SBtIGXg5lDm0OdQ7SBtIGfQ6EDooOjQ6UDtIGmg6hDtIG0gaoDqwO0ga0DrwO0gZgAGAAYADEDmAAYAAkBtIGzA5gANIOYADaDokO0gbSBt8O5w7SBu8O0gb1DvwO0gZgAGAAxA7SBtIG0gbSBtIGYABgAGAAYAAED2AAsAUMD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHJA8sBywHLAcsBywHLAccDywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywPLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAc0D9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHPA/SBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gYUD0QPlQCVAJUAMAAwADAAMACVAJUAlQCVAJUAlQCVAEwPMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA//8EAAQABAAEAAQABAAEAAQABAANAAMAAQABAAIABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQACgATABcAHgAbABoAHgAXABYAEgAeABsAGAAPABgAHABLAEsASwBLAEsASwBLAEsASwBLABgAGAAeAB4AHgATAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABYAGwASAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWAA0AEQAeAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAFAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJABYAGgAbABsAGwAeAB0AHQAeAE8AFwAeAA0AHgAeABoAGwBPAE8ADgBQAB0AHQAdAE8ATwAXAE8ATwBPABYAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAFAATwBAAE8ATwBPAEAATwBQAFAATwBQAB4AHgAeAB4AHgAeAB0AHQAdAB0AHgAdAB4ADgBQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgBQAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAkACQAJAAkACQAJAAkABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAFAAHgAeAB4AKwArAFAAUABQAFAAGABQACsAKwArACsAHgAeAFAAHgBQAFAAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUAAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAYAA0AKwArAB4AHgAbACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAB4ABAAEAB4ABAAEABMABAArACsAKwArACsAKwArACsAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAKwArACsAKwBWAFYAVgBWAB4AHgArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AGgAaABoAGAAYAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQAEwAEACsAEwATAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABLAEsASwBLAEsASwBLAEsASwBLABoAGQAZAB4AUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABMAUAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABABQAFAABAAEAB4ABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUAAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAFAABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQAUABQAB4AHgAYABMAUAArACsABAAbABsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAFAABAAEAAQABAAEAFAABAAEAAQAUAAEAAQABAAEAAQAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArACsAHgArAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAUAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEAA0ADQBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUAArACsAKwBQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABABQACsAKwArACsAKwArACsAKwAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUAAaABoAUABQAFAAUABQAEwAHgAbAFAAHgAEACsAKwAEAAQABAArAFAAUABQAFAAUABQACsAKwArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQACsAUABQACsAKwAEACsABAAEAAQABAAEACsAKwArACsABAAEACsAKwAEAAQABAArACsAKwAEACsAKwArACsAKwArACsAUABQAFAAUAArAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLAAQABABQAFAAUAAEAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAArACsAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AGwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAKwArACsAKwArAAQABAAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAAQAUAArAFAAUABQAFAAUABQACsAKwArAFAAUABQACsAUABQAFAAUAArACsAKwBQAFAAKwBQACsAUABQACsAKwArAFAAUAArACsAKwBQAFAAUAArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArAAQABAAEAAQABAArACsAKwAEAAQABAArAAQABAAEAAQAKwArAFAAKwArACsAKwArACsABAArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAHgAeAB4AHgAeAB4AGwAeACsAKwArACsAKwAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAUABQAFAAKwArACsAKwArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwAOAFAAUABQAFAAUABQAFAAHgBQAAQABAAEAA4AUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAKwArAAQAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAKwArACsAKwArACsAUAArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAFAABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQABABQAB4AKwArACsAKwBQAFAAUAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQABoAUABQAFAAUABQAFAAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQACsAUAArACsAUABQAFAAUABQAFAAUAArACsAKwAEACsAKwArACsABAAEAAQABAAEAAQAKwAEACsABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArAAQABAAeACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAXAAqACoAKgAqACoAKgAqACsAKwArACsAGwBcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAeAEsASwBLAEsASwBLAEsASwBLAEsADQANACsAKwArACsAKwBcAFwAKwBcACsAXABcAFwAXABcACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAXAArAFwAXABcAFwAXABcAFwAXABcAFwAKgBcAFwAKgAqACoAKgAqACoAKgAqACoAXAArACsAXABcAFwAXABcACsAXAArACoAKgAqACoAKgAqACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwBcAFwAXABcAFAADgAOAA4ADgAeAA4ADgAJAA4ADgANAAkAEwATABMAEwATAAkAHgATAB4AHgAeAAQABAAeAB4AHgAeAB4AHgBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQAFAADQAEAB4ABAAeAAQAFgARABYAEQAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAAQABAAEAAQADQAEAAQAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAA0ADQAeAB4AHgAeAB4AHgAEAB4AHgAeAB4AHgAeACsAHgAeAA4ADgANAA4AHgAeAB4AHgAeAAkACQArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgBcAEsASwBLAEsASwBLAEsASwBLAEsADQANAB4AHgAeAB4AXABcAFwAXABcAFwAKgAqACoAKgBcAFwAXABcACoAKgAqAFwAKgAqACoAXABcACoAKgAqACoAKgAqACoAXABcAFwAKgAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqAFwAKgBLAEsASwBLAEsASwBLAEsASwBLACoAKgAqACoAKgAqAFAAUABQAFAAUABQACsAUAArACsAKwArACsAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAKwBQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsABAAEAAQAHgANAB4AHgAeAB4AHgAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUAArACsADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWABEAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQANAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAANAA0AKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUAArAAQABAArACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqAA0ADQAVAFwADQAeAA0AGwBcACoAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwAeAB4AEwATAA0ADQAOAB4AEwATAB4ABAAEAAQACQArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAHgArACsAKwATABMASwBLAEsASwBLAEsASwBLAEsASwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAXABcAFwAXABcACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAXAArACsAKwAqACoAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsAHgAeAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKwAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKwArAAQASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACoAKgAqACoAKgAqACoAXAAqACoAKgAqACoAKgArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABABQAFAAUABQAFAAUABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwANAA0AHgANAA0ADQANAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwAeAB4AHgAeAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArAA0ADQANAA0ADQBLAEsASwBLAEsASwBLAEsASwBLACsAKwArAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUAAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAAQAUABQAFAAUABQAFAABABQAFAABAAEAAQAUAArACsAKwArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQACsAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAFAAUABQACsAHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQACsAKwAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQACsAHgAeAB4AHgAeAB4AHgAOAB4AKwANAA0ADQANAA0ADQANAAkADQANAA0ACAAEAAsABAAEAA0ACQANAA0ADAAdAB0AHgAXABcAFgAXABcAFwAWABcAHQAdAB4AHgAUABQAFAANAAEAAQAEAAQABAAEAAQACQAaABoAGgAaABoAGgAaABoAHgAXABcAHQAVABUAHgAeAB4AHgAeAB4AGAAWABEAFQAVABUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ADQAeAA0ADQANAA0AHgANAA0ADQAHAB4AHgAeAB4AKwAEAAQABAAEAAQABAAEAAQABAAEAFAAUAArACsATwBQAFAAUABQAFAAHgAeAB4AFgARAE8AUABPAE8ATwBPAFAAUABQAFAAUAAeAB4AHgAWABEAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArABsAGwAbABsAGwAbABsAGgAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGgAbABsAGwAbABoAGwAbABoAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAHgAeAFAAGgAeAB0AHgBQAB4AGgAeAB4AHgAeAB4AHgAeAB4AHgBPAB4AUAAbAB4AHgBQAFAAUABQAFAAHgAeAB4AHQAdAB4AUAAeAFAAHgBQAB4AUABPAFAAUAAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgBQAFAAUABQAE8ATwBQAFAAUABQAFAATwBQAFAATwBQAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAUABQAFAATwBPAE8ATwBPAE8ATwBPAE8ATwBQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABPAB4AHgArACsAKwArAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHQAdAB4AHgAeAB0AHQAeAB4AHQAeAB4AHgAdAB4AHQAbABsAHgAdAB4AHgAeAB4AHQAeAB4AHQAdAB0AHQAeAB4AHQAeAB0AHgAdAB0AHQAdAB0AHQAeAB0AHgAeAB4AHgAeAB0AHQAdAB0AHgAeAB4AHgAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHgAeAB0AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAeAB0AHQAdAB0AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAdAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAWABEAHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAWABEAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AHQAdAB0AHgAeAB0AHgAeAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlAB4AHQAdAB4AHgAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AJQAlAB0AHQAlAB4AJQAlACUAIAAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAdAB0AHQAeAB0AJQAdAB0AHgAdAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAdAB0AHQAdACUAHgAlACUAJQAdACUAJQAdAB0AHQAlACUAHQAdACUAHQAdACUAJQAlAB4AHQAeAB4AHgAeAB0AHQAlAB0AHQAdAB0AHQAdACUAJQAlACUAJQAdACUAJQAgACUAHQAdACUAJQAlACUAJQAlACUAJQAeAB4AHgAlACUAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AFwAXABcAFwAXABcAHgATABMAJQAeAB4AHgAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARABYAEQAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAEAAQABAAeAB4AKwArACsAKwArABMADQANAA0AUAATAA0AUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUAANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAA0ADQANAA0ADQANAA0ADQAeAA0AFgANAB4AHgAXABcAHgAeABcAFwAWABEAFgARABYAEQAWABEADQANAA0ADQATAFAADQANAB4ADQANAB4AHgAeAB4AHgAMAAwADQANAA0AHgANAA0AFgANAA0ADQANAA0ADQANAA0AHgANAB4ADQANAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArAA0AEQARACUAJQBHAFcAVwAWABEAFgARABYAEQAWABEAFgARACUAJQAWABEAFgARABYAEQAWABEAFQAWABEAEQAlAFcAVwBXAFcAVwBXAFcAVwBXAAQABAAEAAQABAAEACUAVwBXAFcAVwA2ACUAJQBXAFcAVwBHAEcAJQAlACUAKwBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBRAFcAUQBXAFEAVwBXAFcAVwBXAFcAUQBXAFcAVwBXAFcAVwBRAFEAKwArAAQABAAVABUARwBHAFcAFQBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBRAFcAVwBXAFcAVwBXAFEAUQBXAFcAVwBXABUAUQBHAEcAVwArACsAKwArACsAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwAlACUAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACsAKwArACsAKwArACsAKwArACsAKwArAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBPAE8ATwBPAE8ATwBPAE8AJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADQATAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABLAEsASwBLAEsASwBLAEsASwBLAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAABAAEAAQABAAeAAQABAAEAAQABAAEAAQABAAEAAQAHgBQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAeAA0ADQANAA0ADQArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAAQAUABQAFAABABQAFAAUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAeAB4AHgAeAAQAKwArACsAUABQAFAAUABQAFAAHgAeABoAHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADgAOABMAEwArACsAKwArACsAKwArACsABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwANAA0ASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUAAeAB4AHgBQAA4AUABQAAQAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArAB4AWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYACsAKwArAAQAHgAeAB4AHgAeAB4ADQANAA0AHgAeAB4AHgArAFAASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArAB4AHgBcAFwAXABcAFwAKgBcAFwAXABcAFwAXABcAFwAXABcAEsASwBLAEsASwBLAEsASwBLAEsAXABcAFwAXABcACsAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAFAAUABQAAQAUABQAFAAUABQAFAAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAHgANAA0ADQBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAXAAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAKgAqACoAXABcACoAKgBcAFwAXABcAFwAKgAqAFwAKgBcACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcACoAKgBQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAA0ADQBQAFAAUAAEAAQAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQADQAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAVABVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBUAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVACsAKwArACsAKwArACsAKwArACsAKwArAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAKwArACsAKwBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAKwArACsAKwAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAKwArACsAKwArAFYABABWAFYAVgBWAFYAVgBWAFYAVgBWAB4AVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgArAFYAVgBWAFYAVgArAFYAKwBWAFYAKwBWAFYAKwBWAFYAVgBWAFYAVgBWAFYAVgBWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAEQAWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAaAB4AKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAGAARABEAGAAYABMAEwAWABEAFAArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACUAJQAlACUAJQAWABEAFgARABYAEQAWABEAFgARABYAEQAlACUAFgARACUAJQAlACUAJQAlACUAEQAlABEAKwAVABUAEwATACUAFgARABYAEQAWABEAJQAlACUAJQAlACUAJQAlACsAJQAbABoAJQArACsAKwArAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAcAKwATACUAJQAbABoAJQAlABYAEQAlACUAEQAlABEAJQBXAFcAVwBXAFcAVwBXAFcAVwBXABUAFQAlACUAJQATACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXABYAJQARACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAWACUAEQAlABYAEQARABYAEQARABUAVwBRAFEAUQBRAFEAUQBRAFEAUQBRAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcARwArACsAVwBXAFcAVwBXAFcAKwArAFcAVwBXAFcAVwBXACsAKwBXAFcAVwBXAFcAVwArACsAVwBXAFcAKwArACsAGgAbACUAJQAlABsAGwArAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAAQAB0AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsADQANAA0AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAA0AUABQAFAAUAArACsAKwArAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwArAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwBQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAUABQAFAAUABQAAQABAAEACsABAAEACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAKwBQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAA0ADQANAA0ADQANAA0ADQAeACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAArACsAKwArAFAAUABQAFAAUAANAA0ADQANAA0ADQAUACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsADQANAA0ADQANAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArAAQABAANACsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAB4AHgAeAB4AHgArACsAKwArACsAKwAEAAQABAAEAAQABAAEAA0ADQAeAB4AHgAeAB4AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsASwBLAEsASwBLAEsASwBLAEsASwANAA0ADQANAFAABAAEAFAAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAeAA4AUAArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAADQANAB4ADQAEAAQABAAEAB4ABAAEAEsASwBLAEsASwBLAEsASwBLAEsAUAAOAFAADQANAA0AKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAANAA0AHgANAA0AHgAEACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAA0AKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsABAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsABAAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAUAArACsAKwArACsAKwAEACsAKwArACsAKwBQAFAAUABQAFAABAAEACsAKwAEAAQABAAEAAQABAAEACsAKwArAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAQABABQAFAAUABQAA0ADQANAA0AHgBLAEsASwBLAEsASwBLAEsASwBLAA0ADQArAB4ABABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUAAeAFAAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABAAEAAQADgANAA0AEwATAB4AHgAeAA0ADQANAA0ADQANAA0ADQANAA0ADQANAA0ADQANAFAAUABQAFAABAAEACsAKwAEAA0ADQAeAFAAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKwArACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBcAFwADQANAA0AKgBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAKwArAFAAKwArAFAAUABQAFAAUABQAFAAUAArAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQAKwAEAAQAKwArAAQABAAEAAQAUAAEAFAABAAEAA0ADQANACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABABQAA4AUAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAFAABAAEAAQABAAOAB4ADQANAA0ADQAOAB4ABAArACsAKwArACsAKwArACsAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAA0ADQANAFAADgAOAA4ADQANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAAQABAAEAFAADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAOABMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAArACsAKwAEACsABAAEACsABAAEAAQABAAEAAQABABQAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAaABoAGgAaAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABIAEgAQwBDAEMAUABQAFAAUABDAFAAUABQAEgAQwBIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABDAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAJAAkACQAJAAkACQAJABYAEQArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwANAA0AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAANACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAA0ADQANAB4AHgAeAB4AHgAeAFAAUABQAFAADQAeACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAA0AHgAeACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAARwBHABUARwAJACsAKwArACsAKwArACsAKwArACsAKwAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUQBRAFEAKwArACsAKwArACsAKwArACsAKwArACsAKwBRAFEAUQBRACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAHgAEAAQADQAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQABAAEAAQABAAeAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQAHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAKwArAFAAKwArAFAAUAArACsAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUAArAFAAUABQAFAAUABQAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAHgAeAFAAUABQAFAAUAArAFAAKwArACsAUABQAFAAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeACsAKwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4ABAAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAHgAeAA0ADQANAA0AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArAAQABAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwBQAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArABsAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAB4AHgAeAB4ABAAEAAQABAAEAAQABABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArABYAFgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAGgBQAFAAUAAaAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUAArACsAKwArACsAKwBQACsAKwArACsAUAArAFAAKwBQACsAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUAArAFAAKwBQACsAUAArAFAAUAArAFAAKwArAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAKwBQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8AJQAlACUAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB4AHgAeACUAJQAlAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAlACUAJQAlACUAHgAlACUAJQAlACUAIAAgACAAJQAlACAAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACEAIQAhACEAIQAlACUAIAAgACUAJQAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAIAAlACUAJQAlACAAIAAgACUAIAAgACAAJQAlACUAJQAlACUAJQAgACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAlAB4AJQAeACUAJQAlACUAJQAgACUAJQAlACUAHgAlAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACAAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABcAFwAXABUAFQAVAB4AHgAeAB4AJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAgACUAJQAgACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAIAAgACUAJQAgACAAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACAAIAAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACAAIAAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAA==", jw = 50, O4 = 1, H0 = 2, S0 = 3, N4 = 4, M4 = 5, Yw = 7, L0 = 8, Zw = 9, gi = 10, ld = 11, Am = 12, cd = 13, P4 = 14, ns = 15, fd = 16, hl = 17, qo = 18, K4 = 19, em = 20, hd = 21, zo = 22, gh = 23, Ta = 24, an = 25, rs = 26, is = 27, Da = 28, R4 = 29, zi = 30, k4 = 31, dl = 32, pl = 33, dd = 34, pd = 35, gd = 36, Is = 37, Bd = 38, $l = 39, Gl = 40, Bh = 41, T0 = 42, $4 = 43, G4 = [9001, 65288], D0 = "!", Ue = "×", gl = "÷", wd = S4(D4), Dr = [zi, gd], md = [O4, H0, S0, M4], O0 = [gi, L0], tm = [is, rs], V4 = md.concat(O0), nm = [Bd, $l, Gl, dd, pd], W4 = [ns, cd], X4 = function(A, e) {
  e === void 0 && (e = "strict");
  var t = [], n = [], i = [];
  return A.forEach(function(s, l) {
    var f = wd.get(s);
    if (f > jw ? (i.push(!0), f -= jw) : i.push(!1), ["normal", "auto", "loose"].indexOf(e) !== -1 && [8208, 8211, 12316, 12448].indexOf(s) !== -1)
      return n.push(l), t.push(fd);
    if (f === N4 || f === ld) {
      if (l === 0)
        return n.push(l), t.push(zi);
      var c = t[l - 1];
      return V4.indexOf(c) === -1 ? (n.push(n[l - 1]), t.push(c)) : (n.push(l), t.push(zi));
    }
    if (n.push(l), f === k4)
      return t.push(e === "strict" ? hd : Is);
    if (f === T0 || f === R4)
      return t.push(zi);
    if (f === $4)
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
}, rm = function(A, e) {
  for (var t = A; t >= 0; ) {
    var n = e[t];
    if (n === gi)
      t--;
    else
      return n;
  }
  return 0;
}, q4 = function(A, e, t, n, i) {
  if (t[n] === 0)
    return Ue;
  var s = n - 1;
  if (Array.isArray(i) && i[s] === !0)
    return Ue;
  var l = s - 1, f = s + 1, c = e[s], h = l >= 0 ? e[l] : 0, w = e[f];
  if (c === H0 && w === S0)
    return Ue;
  if (md.indexOf(c) !== -1)
    return D0;
  if (md.indexOf(w) !== -1 || O0.indexOf(w) !== -1)
    return Ue;
  if (rm(s, e) === L0)
    return gl;
  if (wd.get(A[s]) === ld || (c === dl || c === pl) && wd.get(A[f]) === ld || c === Yw || w === Yw || c === Zw || [gi, cd, ns].indexOf(c) === -1 && w === Zw || [hl, qo, K4, Ta, Da].indexOf(w) !== -1 || rm(s, e) === zo || wh(gh, zo, s, e) || wh([hl, qo], hd, s, e) || wh(Am, Am, s, e))
    return Ue;
  if (c === gi)
    return gl;
  if (c === gh || w === gh)
    return Ue;
  if (w === fd || c === fd)
    return gl;
  if ([cd, ns, hd].indexOf(w) !== -1 || c === P4 || h === gd && W4.indexOf(c) !== -1 || c === Da && w === gd || w === em || Dr.indexOf(w) !== -1 && c === an || Dr.indexOf(c) !== -1 && w === an || c === is && [Is, dl, pl].indexOf(w) !== -1 || [Is, dl, pl].indexOf(c) !== -1 && w === rs || Dr.indexOf(c) !== -1 && tm.indexOf(w) !== -1 || tm.indexOf(c) !== -1 && Dr.indexOf(w) !== -1 || // (PR | PO) × ( OP | HY )? NU
  [is, rs].indexOf(c) !== -1 && (w === an || [zo, ns].indexOf(w) !== -1 && e[f + 1] === an) || // ( OP | HY ) × NU
  [zo, ns].indexOf(c) !== -1 && w === an || // NU ×	(NU | SY | IS)
  c === an && [an, Da, Ta].indexOf(w) !== -1)
    return Ue;
  if ([an, Da, Ta, hl, qo].indexOf(w) !== -1)
    for (var B = s; B >= 0; ) {
      var p = e[B];
      if (p === an)
        return Ue;
      if ([Da, Ta].indexOf(p) !== -1)
        B--;
      else
        break;
    }
  if ([is, rs].indexOf(w) !== -1)
    for (var B = [hl, qo].indexOf(c) !== -1 ? l : s; B >= 0; ) {
      var p = e[B];
      if (p === an)
        return Ue;
      if ([Da, Ta].indexOf(p) !== -1)
        B--;
      else
        break;
    }
  if (Bd === c && [Bd, $l, dd, pd].indexOf(w) !== -1 || [$l, dd].indexOf(c) !== -1 && [$l, Gl].indexOf(w) !== -1 || [Gl, pd].indexOf(c) !== -1 && w === Gl || nm.indexOf(c) !== -1 && [em, rs].indexOf(w) !== -1 || nm.indexOf(w) !== -1 && c === is || Dr.indexOf(c) !== -1 && Dr.indexOf(w) !== -1 || c === Ta && Dr.indexOf(w) !== -1 || Dr.concat(an).indexOf(c) !== -1 && w === zo && G4.indexOf(A[f]) === -1 || Dr.concat(an).indexOf(w) !== -1 && c === qo)
    return Ue;
  if (c === Bh && w === Bh) {
    for (var v = t[s], o = 1; v > 0 && (v--, e[v] === Bh); )
      o++;
    if (o % 2 !== 0)
      return Ue;
  }
  return c === dl && w === pl ? Ue : gl;
}, z4 = function(A, e) {
  e || (e = { lineBreak: "normal", wordBreak: "normal" });
  var t = X4(A, e.lineBreak), n = t[0], i = t[1], s = t[2];
  (e.wordBreak === "break-all" || e.wordBreak === "break-word") && (i = i.map(function(f) {
    return [an, zi, T0].indexOf(f) !== -1 ? Is : f;
  }));
  var l = e.wordBreak === "keep-all" ? s.map(function(f, c) {
    return f && A[c] >= 19968 && A[c] <= 40959;
  }) : void 0;
  return [n, i, l];
}, J4 = (
  /** @class */
  function() {
    function A(e, t, n, i) {
      this.codePoints = e, this.required = t === D0, this.start = n, this.end = i;
    }
    return A.prototype.slice = function() {
      return it.apply(void 0, this.codePoints.slice(this.start, this.end));
    }, A;
  }()
), j4 = function(A, e) {
  var t = Lc(A), n = z4(t, e), i = n[0], s = n[1], l = n[2], f = t.length, c = 0, h = 0;
  return {
    next: function() {
      if (h >= f)
        return { done: !0, value: null };
      for (var w = Ue; h < f && (w = q4(t, s, i, ++h, l)) === Ue; )
        ;
      if (w !== Ue || h === f) {
        var B = new J4(t, w, c, h);
        return c = h, { value: B, done: !1 };
      }
      return { done: !0, value: null };
    }
  };
}, Y4 = 1, Z4 = 2, Rs = 4, im = 8, lc = 10, am = 47, gs = 92, AN = 9, eN = 32, Bl = 34, Jo = 61, tN = 35, nN = 36, rN = 37, wl = 39, ml = 40, jo = 41, iN = 95, Jt = 45, aN = 33, oN = 60, sN = 62, uN = 64, lN = 91, cN = 93, fN = 61, hN = 123, vl = 63, dN = 125, om = 124, pN = 126, gN = 128, sm = 65533, mh = 42, ji = 43, BN = 44, wN = 58, mN = 59, Hs = 46, vN = 0, yN = 8, CN = 11, QN = 14, FN = 31, UN = 127, rr = -1, N0 = 48, M0 = 97, P0 = 101, bN = 102, EN = 117, _N = 122, K0 = 65, R0 = 69, k0 = 70, xN = 85, IN = 90, Tt = function(A) {
  return A >= N0 && A <= 57;
}, HN = function(A) {
  return A >= 55296 && A <= 57343;
}, Oa = function(A) {
  return Tt(A) || A >= K0 && A <= k0 || A >= M0 && A <= bN;
}, SN = function(A) {
  return A >= M0 && A <= _N;
}, LN = function(A) {
  return A >= K0 && A <= IN;
}, TN = function(A) {
  return SN(A) || LN(A);
}, DN = function(A) {
  return A >= gN;
}, yl = function(A) {
  return A === lc || A === AN || A === eN;
}, cc = function(A) {
  return TN(A) || DN(A) || A === iN;
}, um = function(A) {
  return cc(A) || Tt(A) || A === Jt;
}, ON = function(A) {
  return A >= vN && A <= yN || A === CN || A >= QN && A <= FN || A === UN;
}, hi = function(A, e) {
  return A !== gs ? !1 : e !== lc;
}, Cl = function(A, e, t) {
  return A === Jt ? cc(e) || hi(e, t) : cc(A) ? !0 : !!(A === gs && hi(A, e));
}, vh = function(A, e, t) {
  return A === ji || A === Jt ? Tt(e) ? !0 : e === Hs && Tt(t) : Tt(A === Hs ? e : A);
}, NN = function(A) {
  var e = 0, t = 1;
  (A[e] === ji || A[e] === Jt) && (A[e] === Jt && (t = -1), e++);
  for (var n = []; Tt(A[e]); )
    n.push(A[e++]);
  var i = n.length ? parseInt(it.apply(void 0, n), 10) : 0;
  A[e] === Hs && e++;
  for (var s = []; Tt(A[e]); )
    s.push(A[e++]);
  var l = s.length, f = l ? parseInt(it.apply(void 0, s), 10) : 0;
  (A[e] === R0 || A[e] === P0) && e++;
  var c = 1;
  (A[e] === ji || A[e] === Jt) && (A[e] === Jt && (c = -1), e++);
  for (var h = []; Tt(A[e]); )
    h.push(A[e++]);
  var w = h.length ? parseInt(it.apply(void 0, h), 10) : 0;
  return t * (i + f * Math.pow(10, -l)) * Math.pow(10, c * w);
}, MN = {
  type: 2
  /* LEFT_PARENTHESIS_TOKEN */
}, PN = {
  type: 3
  /* RIGHT_PARENTHESIS_TOKEN */
}, KN = {
  type: 4
  /* COMMA_TOKEN */
}, RN = {
  type: 13
  /* SUFFIX_MATCH_TOKEN */
}, kN = {
  type: 8
  /* PREFIX_MATCH_TOKEN */
}, $N = {
  type: 21
  /* COLUMN_TOKEN */
}, GN = {
  type: 9
  /* DASH_MATCH_TOKEN */
}, VN = {
  type: 10
  /* INCLUDE_MATCH_TOKEN */
}, WN = {
  type: 11
  /* LEFT_CURLY_BRACKET_TOKEN */
}, XN = {
  type: 12
  /* RIGHT_CURLY_BRACKET_TOKEN */
}, qN = {
  type: 14
  /* SUBSTRING_MATCH_TOKEN */
}, Ql = {
  type: 23
  /* BAD_URL_TOKEN */
}, zN = {
  type: 1
  /* BAD_STRING_TOKEN */
}, JN = {
  type: 25
  /* CDO_TOKEN */
}, jN = {
  type: 24
  /* CDC_TOKEN */
}, YN = {
  type: 26
  /* COLON_TOKEN */
}, ZN = {
  type: 27
  /* SEMICOLON_TOKEN */
}, AM = {
  type: 28
  /* LEFT_SQUARE_BRACKET_TOKEN */
}, eM = {
  type: 29
  /* RIGHT_SQUARE_BRACKET_TOKEN */
}, tM = {
  type: 31
  /* WHITESPACE_TOKEN */
}, vd = {
  type: 32
  /* EOF_TOKEN */
}, $0 = (
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
        case tN:
          var t = this.peekCodePoint(0), n = this.peekCodePoint(1), i = this.peekCodePoint(2);
          if (um(t) || hi(n, i)) {
            var s = Cl(t, n, i) ? Z4 : Y4, l = this.consumeName();
            return { type: 5, value: l, flags: s };
          }
          break;
        case nN:
          if (this.peekCodePoint(0) === Jo)
            return this.consumeCodePoint(), RN;
          break;
        case wl:
          return this.consumeStringToken(wl);
        case ml:
          return MN;
        case jo:
          return PN;
        case mh:
          if (this.peekCodePoint(0) === Jo)
            return this.consumeCodePoint(), qN;
          break;
        case ji:
          if (vh(e, this.peekCodePoint(0), this.peekCodePoint(1)))
            return this.reconsumeCodePoint(e), this.consumeNumericToken();
          break;
        case BN:
          return KN;
        case Jt:
          var f = e, c = this.peekCodePoint(0), h = this.peekCodePoint(1);
          if (vh(f, c, h))
            return this.reconsumeCodePoint(e), this.consumeNumericToken();
          if (Cl(f, c, h))
            return this.reconsumeCodePoint(e), this.consumeIdentLikeToken();
          if (c === Jt && h === sN)
            return this.consumeCodePoint(), this.consumeCodePoint(), jN;
          break;
        case Hs:
          if (vh(e, this.peekCodePoint(0), this.peekCodePoint(1)))
            return this.reconsumeCodePoint(e), this.consumeNumericToken();
          break;
        case am:
          if (this.peekCodePoint(0) === mh)
            for (this.consumeCodePoint(); ; ) {
              var w = this.consumeCodePoint();
              if (w === mh && (w = this.consumeCodePoint(), w === am))
                return this.consumeToken();
              if (w === rr)
                return this.consumeToken();
            }
          break;
        case wN:
          return YN;
        case mN:
          return ZN;
        case oN:
          if (this.peekCodePoint(0) === aN && this.peekCodePoint(1) === Jt && this.peekCodePoint(2) === Jt)
            return this.consumeCodePoint(), this.consumeCodePoint(), JN;
          break;
        case uN:
          var B = this.peekCodePoint(0), p = this.peekCodePoint(1), v = this.peekCodePoint(2);
          if (Cl(B, p, v)) {
            var l = this.consumeName();
            return { type: 7, value: l };
          }
          break;
        case lN:
          return AM;
        case gs:
          if (hi(e, this.peekCodePoint(0)))
            return this.reconsumeCodePoint(e), this.consumeIdentLikeToken();
          break;
        case cN:
          return eM;
        case fN:
          if (this.peekCodePoint(0) === Jo)
            return this.consumeCodePoint(), kN;
          break;
        case hN:
          return WN;
        case dN:
          return XN;
        case EN:
        case xN:
          var o = this.peekCodePoint(0), C = this.peekCodePoint(1);
          return o === ji && (Oa(C) || C === vl) && (this.consumeCodePoint(), this.consumeUnicodeRangeToken()), this.reconsumeCodePoint(e), this.consumeIdentLikeToken();
        case om:
          if (this.peekCodePoint(0) === Jo)
            return this.consumeCodePoint(), GN;
          if (this.peekCodePoint(0) === om)
            return this.consumeCodePoint(), $N;
          break;
        case pN:
          if (this.peekCodePoint(0) === Jo)
            return this.consumeCodePoint(), VN;
          break;
        case rr:
          return vd;
      }
      return yl(e) ? (this.consumeWhiteSpace(), tM) : Tt(e) ? (this.reconsumeCodePoint(e), this.consumeNumericToken()) : cc(e) ? (this.reconsumeCodePoint(e), this.consumeIdentLikeToken()) : { type: 6, value: it(e) };
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
        var i = parseInt(it.apply(void 0, e.map(function(c) {
          return c === vl ? N0 : c;
        })), 16), s = parseInt(it.apply(void 0, e.map(function(c) {
          return c === vl ? k0 : c;
        })), 16);
        return { type: 30, start: i, end: s };
      }
      var l = parseInt(it.apply(void 0, e), 16);
      if (this.peekCodePoint(0) === Jt && Oa(this.peekCodePoint(1))) {
        this.consumeCodePoint(), t = this.consumeCodePoint();
        for (var f = []; Oa(t) && f.length < 6; )
          f.push(t), t = this.consumeCodePoint();
        var s = parseInt(it.apply(void 0, f), 16);
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
          return { type: 22, value: it.apply(void 0, e) };
        if (yl(i))
          return this.consumeWhiteSpace(), this.peekCodePoint(0) === rr || this.peekCodePoint(0) === jo ? (this.consumeCodePoint(), { type: 22, value: it.apply(void 0, e) }) : (this.consumeBadUrlRemnants(), Ql);
        if (i === Bl || i === wl || i === ml || ON(i))
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
        n += it.apply(void 0, this._value.splice(0, i)), e -= i;
      }
      return this._value.shift(), n;
    }, A.prototype.consumeStringToken = function(e) {
      var t = "", n = 0;
      do {
        var i = this._value[n];
        if (i === rr || i === void 0 || i === e)
          return t += this.consumeStringSlice(n), { type: 0, value: t };
        if (i === lc)
          return this._value.splice(0, n), zN;
        if (i === gs) {
          var s = this._value[n + 1];
          s !== rr && s !== void 0 && (s === lc ? (t += this.consumeStringSlice(n), n = -1, this._value.shift()) : hi(i, s) && (t += this.consumeStringSlice(n), t += it(this.consumeEscapedCodePoint()), n = -1));
        }
        n++;
      } while (!0);
    }, A.prototype.consumeNumber = function() {
      var e = [], t = Rs, n = this.peekCodePoint(0);
      for ((n === ji || n === Jt) && e.push(this.consumeCodePoint()); Tt(this.peekCodePoint(0)); )
        e.push(this.consumeCodePoint());
      n = this.peekCodePoint(0);
      var i = this.peekCodePoint(1);
      if (n === Hs && Tt(i))
        for (e.push(this.consumeCodePoint(), this.consumeCodePoint()), t = im; Tt(this.peekCodePoint(0)); )
          e.push(this.consumeCodePoint());
      n = this.peekCodePoint(0), i = this.peekCodePoint(1);
      var s = this.peekCodePoint(2);
      if ((n === R0 || n === P0) && ((i === ji || i === Jt) && Tt(s) || Tt(i)))
        for (e.push(this.consumeCodePoint(), this.consumeCodePoint()), t = im; Tt(this.peekCodePoint(0)); )
          e.push(this.consumeCodePoint());
      return [NN(e), t];
    }, A.prototype.consumeNumericToken = function() {
      var e = this.consumeNumber(), t = e[0], n = e[1], i = this.peekCodePoint(0), s = this.peekCodePoint(1), l = this.peekCodePoint(2);
      if (Cl(i, s, l)) {
        var f = this.consumeName();
        return { type: 15, number: t, flags: n, unit: f };
      }
      return i === rN ? (this.consumeCodePoint(), { type: 16, number: t, flags: n }) : { type: 17, number: t, flags: n };
    }, A.prototype.consumeEscapedCodePoint = function() {
      var e = this.consumeCodePoint();
      if (Oa(e)) {
        for (var t = it(e); Oa(this.peekCodePoint(0)) && t.length < 6; )
          t += it(this.consumeCodePoint());
        yl(this.peekCodePoint(0)) && this.consumeCodePoint();
        var n = parseInt(t, 16);
        return n === 0 || HN(n) || n > 1114111 ? sm : n;
      }
      return e === rr ? sm : e;
    }, A.prototype.consumeName = function() {
      for (var e = ""; ; ) {
        var t = this.consumeCodePoint();
        if (um(t))
          e += it(t);
        else if (hi(t, this.peekCodePoint(0)))
          e += it(this.consumeEscapedCodePoint());
        else
          return this.reconsumeCodePoint(t), e;
      }
    }, A;
  }()
), G0 = (
  /** @class */
  function() {
    function A(e) {
      this._tokens = e;
    }
    return A.create = function(e) {
      var t = new $0();
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
        if (n.type === 32 || rM(n, e))
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
), ks = function(A) {
  return A.type === 15;
}, lo = function(A) {
  return A.type === 17;
}, Re = function(A) {
  return A.type === 20;
}, nM = function(A) {
  return A.type === 0;
}, yd = function(A, e) {
  return Re(A) && A.value === e;
}, V0 = function(A) {
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
}, rM = function(A, e) {
  return e === 11 && A.type === 12 || e === 28 && A.type === 29 ? !0 : e === 2 && A.type === 3;
}, yi = function(A) {
  return A.type === 17 || A.type === 15;
}, ot = function(A) {
  return A.type === 16 || yi(A);
}, W0 = function(A) {
  return A.length > 1 ? [A[0], A[1]] : [A[0]];
}, Qt = {
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
  return [Ve(n, e), Ve(typeof i < "u" ? i : n, t)];
}, Ve = function(A, e) {
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
}, X0 = "deg", q0 = "grad", z0 = "rad", J0 = "turn", Tc = {
  name: "angle",
  parse: function(A, e) {
    if (e.type === 15)
      switch (e.unit) {
        case X0:
          return Math.PI * e.number / 180;
        case q0:
          return Math.PI / 200 * e.number;
        case z0:
          return e.number;
        case J0:
          return Math.PI * 2 * e.number;
      }
    throw new Error("Unsupported angle type");
  }
}, j0 = function(A) {
  return A.type === 15 && (A.unit === X0 || A.unit === q0 || A.unit === z0 || A.unit === J0);
}, Y0 = function(A) {
  var e = A.filter(Re).map(function(t) {
    return t.value;
  }).join(" ");
  switch (e) {
    case "to bottom right":
    case "to right bottom":
    case "left top":
    case "top left":
      return [Qt, Qt];
    case "to top":
    case "bottom":
      return vn(0);
    case "to bottom left":
    case "to left bottom":
    case "right top":
    case "top right":
      return [Qt, Bi];
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
      return [Bi, Qt];
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
      var t = iM[e.name];
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
}, pt = function(A) {
  var e = 255 & A, t = 255 & A >> 8, n = 255 & A >> 16, i = 255 & A >> 24;
  return e < 255 ? "rgba(" + i + "," + n + "," + t + "," + e / 255 + ")" : "rgb(" + i + "," + n + "," + t + ")";
}, wi = function(A, e, t, n) {
  return (A << 24 | e << 16 | t << 8 | Math.round(n * 255) << 0) >>> 0;
}, lm = function(A, e) {
  if (A.type === 17)
    return A.number;
  if (A.type === 16) {
    var t = e === 3 ? 1 : 255;
    return e === 3 ? A.number / 100 * t : Math.round(A.number / 100 * t);
  }
  return 0;
}, cm = function(A, e) {
  var t = e.filter(ao);
  if (t.length === 3) {
    var n = t.map(lm), i = n[0], s = n[1], l = n[2];
    return wi(i, s, l, 1);
  }
  if (t.length === 4) {
    var f = t.map(lm), i = f[0], s = f[1], l = f[2], c = f[3];
    return wi(i, s, l, c);
  }
  return 0;
};
function yh(A, e, t) {
  return t < 0 && (t += 1), t >= 1 && (t -= 1), t < 1 / 6 ? (e - A) * t * 6 + A : t < 1 / 2 ? e : t < 2 / 3 ? (e - A) * 6 * (2 / 3 - t) + A : A;
}
var fm = function(A, e) {
  var t = e.filter(ao), n = t[0], i = t[1], s = t[2], l = t[3], f = (n.type === 17 ? vn(n.number) : Tc.parse(A, n)) / (Math.PI * 2), c = ot(i) ? i.number / 100 : 0, h = ot(s) ? s.number / 100 : 0, w = typeof l < "u" && ot(l) ? Ve(l, 1) : 1;
  if (c === 0)
    return wi(h * 255, h * 255, h * 255, 1);
  var B = h <= 0.5 ? h * (c + 1) : h + c - h * c, p = h * 2 - B, v = yh(p, B, f + 1 / 3), o = yh(p, B, f), C = yh(p, B, f - 1 / 3);
  return wi(v * 255, o * 255, C * 255, w);
}, iM = {
  hsl: fm,
  hsla: fm,
  rgb: cm,
  rgba: cm
}, Bs = function(A, e) {
  return mi.parse(A, G0.create(e).parseComponentValue());
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
}, aM = {
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
}, oM = {
  name: "background-color",
  initialValue: "transparent",
  prefix: !1,
  type: 3,
  format: "color"
}, Dc = function(A, e) {
  var t = mi.parse(A, e[0]), n = e[1];
  return n && ot(n) ? { color: t, stop: n } : { color: t, stop: null };
}, hm = function(A, e) {
  var t = A[0], n = A[A.length - 1];
  t.stop === null && (t.stop = Qt), n.stop === null && (n.stop = Bi);
  for (var i = [], s = 0, l = 0; l < A.length; l++) {
    var f = A[l].stop;
    if (f !== null) {
      var c = Ve(f, e);
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
}, sM = function(A, e, t) {
  var n = e / 2, i = t / 2, s = Ve(A[0], e) - n, l = i - Ve(A[1], t);
  return (Math.atan2(l, s) + Math.PI * 2) % (Math.PI * 2);
}, uM = function(A, e, t) {
  var n = typeof A == "number" ? A : sM(A, e, t), i = Math.abs(e * Math.sin(n)) + Math.abs(t * Math.cos(n)), s = e / 2, l = t / 2, f = i / 2, c = Math.sin(n - Math.PI / 2) * f, h = Math.cos(n - Math.PI / 2) * f;
  return [i, s - h, s + h, l - c, l + c];
}, Rn = function(A, e) {
  return Math.sqrt(A * A + e * e);
}, dm = function(A, e, t, n, i) {
  var s = [
    [0, 0],
    [0, e],
    [A, 0],
    [A, e]
  ];
  return s.reduce(function(l, f) {
    var c = f[0], h = f[1], w = Rn(t - c, n - h);
    return (i ? w < l.optimumDistance : w > l.optimumDistance) ? {
      optimumCorner: f,
      optimumDistance: w
    } : l;
  }, {
    optimumDistance: i ? 1 / 0 : -1 / 0,
    optimumCorner: null
  }).optimumCorner;
}, lM = function(A, e, t, n, i) {
  var s = 0, l = 0;
  switch (A.size) {
    case 0:
      A.shape === 0 ? s = l = Math.min(Math.abs(e), Math.abs(e - n), Math.abs(t), Math.abs(t - i)) : A.shape === 1 && (s = Math.min(Math.abs(e), Math.abs(e - n)), l = Math.min(Math.abs(t), Math.abs(t - i)));
      break;
    case 2:
      if (A.shape === 0)
        s = l = Math.min(Rn(e, t), Rn(e, t - i), Rn(e - n, t), Rn(e - n, t - i));
      else if (A.shape === 1) {
        var f = Math.min(Math.abs(t), Math.abs(t - i)) / Math.min(Math.abs(e), Math.abs(e - n)), c = dm(n, i, e, t, !0), h = c[0], w = c[1];
        s = Rn(h - e, (w - t) / f), l = f * s;
      }
      break;
    case 1:
      A.shape === 0 ? s = l = Math.max(Math.abs(e), Math.abs(e - n), Math.abs(t), Math.abs(t - i)) : A.shape === 1 && (s = Math.max(Math.abs(e), Math.abs(e - n)), l = Math.max(Math.abs(t), Math.abs(t - i)));
      break;
    case 3:
      if (A.shape === 0)
        s = l = Math.max(Rn(e, t), Rn(e, t - i), Rn(e - n, t), Rn(e - n, t - i));
      else if (A.shape === 1) {
        var f = Math.max(Math.abs(t), Math.abs(t - i)) / Math.max(Math.abs(e), Math.abs(e - n)), B = dm(n, i, e, t, !1), h = B[0], w = B[1];
        s = Rn(h - e, (w - t) / f), l = f * s;
      }
      break;
  }
  return Array.isArray(A.size) && (s = Ve(A.size[0], n), l = A.size.length === 2 ? Ve(A.size[1], i) : s), [s, l];
}, cM = function(A, e) {
  var t = vn(180), n = [];
  return fr(e).forEach(function(i, s) {
    if (s === 0) {
      var l = i[0];
      if (l.type === 20 && l.value === "to") {
        t = Y0(i);
        return;
      } else if (j0(l)) {
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
        t = Y0(i);
        return;
      } else if (j0(l)) {
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
}, fM = function(A, e) {
  var t = vn(180), n = [], i = 1, s = 0, l = 3, f = [];
  return fr(e).forEach(function(c, h) {
    var w = c[0];
    if (h === 0) {
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
        var B = mi.parse(A, w.values[0]);
        n.push({ stop: Qt, color: B });
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
}, Z0 = "closest-side", Ay = "farthest-side", ey = "closest-corner", ty = "farthest-corner", ny = "circle", ry = "ellipse", iy = "cover", ay = "contain", hM = function(A, e) {
  var t = 0, n = 3, i = [], s = [];
  return fr(e).forEach(function(l, f) {
    var c = !0;
    if (f === 0) {
      var h = !1;
      c = l.reduce(function(B, p) {
        if (h)
          if (Re(p))
            switch (p.value) {
              case "center":
                return s.push(Kp), B;
              case "top":
              case "left":
                return s.push(Qt), B;
              case "right":
              case "bottom":
                return s.push(Bi), B;
            }
          else (ot(p) || yi(p)) && s.push(p);
        else if (Re(p))
          switch (p.value) {
            case ny:
              return t = 0, !1;
            case ry:
              return t = 1, !1;
            case "at":
              return h = !0, !1;
            case Z0:
              return n = 0, !1;
            case iy:
            case Ay:
              return n = 1, !1;
            case ay:
            case ey:
              return n = 2, !1;
            case ty:
              return n = 3, !1;
          }
        else if (yi(p) || ot(p))
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
      if (Re(B))
        switch (B.value) {
          case "center":
            return s.push(Kp), !1;
          case "top":
          case "left":
            return s.push(Qt), !1;
          case "right":
          case "bottom":
            return s.push(Bi), !1;
        }
      else if (ot(B) || yi(B))
        return s.push(B), !1;
      return w;
    }, c) : f === 1 && (c = l.reduce(function(w, B) {
      if (Re(B))
        switch (B.value) {
          case ny:
            return t = 0, !1;
          case ry:
            return t = 1, !1;
          case ay:
          case Z0:
            return n = 0, !1;
          case Ay:
            return n = 1, !1;
          case ey:
            return n = 2, !1;
          case iy:
          case ty:
            return n = 3, !1;
        }
      else if (yi(B) || ot(B))
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
}, dM = function(A) {
  return A.type === 1;
}, pM = function(A) {
  return A.type === 2;
}, Rp = {
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
      var n = oy[e.name];
      if (typeof n > "u")
        throw new Error('Attempting to parse an unsupported image function "' + e.name + '"');
      return n(A, e.values);
    }
    throw new Error("Unsupported image type " + e.type);
  }
};
function gM(A) {
  return !(A.type === 20 && A.value === "none") && (A.type !== 18 || !!oy[A.name]);
}
var oy = {
  "linear-gradient": cM,
  "-moz-linear-gradient": Fl,
  "-ms-linear-gradient": Fl,
  "-o-linear-gradient": Fl,
  "-webkit-linear-gradient": Fl,
  "radial-gradient": hM,
  "-moz-radial-gradient": Ul,
  "-ms-radial-gradient": Ul,
  "-o-radial-gradient": Ul,
  "-webkit-radial-gradient": Ul,
  "-webkit-gradient": fM
}, BM = {
  name: "background-image",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(A, e) {
    if (e.length === 0)
      return [];
    var t = e[0];
    return t.type === 20 && t.value === "none" ? [] : e.filter(function(n) {
      return ao(n) && gM(n);
    }).map(function(n) {
      return Rp.parse(A, n);
    });
  }
}, wM = {
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
}, mM = {
  name: "background-position",
  initialValue: "0% 0%",
  type: 1,
  prefix: !1,
  parse: function(A, e) {
    return fr(e).map(function(t) {
      return t.filter(ot);
    }).map(W0);
  }
}, vM = {
  name: "background-repeat",
  initialValue: "repeat",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return fr(e).map(function(t) {
      return t.filter(Re).map(function(n) {
        return n.value;
      }).join(" ");
    }).map(yM);
  }
}, yM = function(A) {
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
}, Ja;
(function(A) {
  A.AUTO = "auto", A.CONTAIN = "contain", A.COVER = "cover";
})(Ja || (Ja = {}));
var CM = {
  name: "background-size",
  initialValue: "0",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return fr(e).map(function(t) {
      return t.filter(QM);
    });
  }
}, QM = function(A) {
  return Re(A) || ot(A);
}, Oc = function(A) {
  return {
    name: "border-" + A + "-color",
    initialValue: "transparent",
    prefix: !1,
    type: 3,
    format: "color"
  };
}, FM = Oc("top"), UM = Oc("right"), bM = Oc("bottom"), EM = Oc("left"), Nc = function(A) {
  return {
    name: "border-radius-" + A,
    initialValue: "0 0",
    prefix: !1,
    type: 1,
    parse: function(e, t) {
      return W0(t.filter(ot));
    }
  };
}, _M = Nc("top-left"), xM = Nc("top-right"), IM = Nc("bottom-right"), HM = Nc("bottom-left"), Mc = function(A) {
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
}, SM = Mc("top"), LM = Mc("right"), TM = Mc("bottom"), DM = Mc("left"), Pc = function(A) {
  return {
    name: "border-" + A + "-width",
    initialValue: "0",
    type: 0,
    prefix: !1,
    parse: function(e, t) {
      return ks(t) ? t.number : 0;
    }
  };
}, OM = Pc("top"), NM = Pc("right"), MM = Pc("bottom"), PM = Pc("left"), KM = {
  name: "color",
  initialValue: "transparent",
  prefix: !1,
  type: 3,
  format: "color"
}, RM = {
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
}, kM = {
  name: "display",
  initialValue: "inline-block",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return e.filter(Re).reduce(
      function(t, n) {
        return t | $M(n.value);
      },
      0
      /* NONE */
    );
  }
}, $M = function(A) {
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
}, GM = {
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
}, VM = {
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
var WM = {
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
}, XM = {
  name: "line-height",
  initialValue: "normal",
  prefix: !1,
  type: 4
  /* TOKEN_VALUE */
}, pm = function(A, e) {
  return Re(A) && A.value === "normal" ? 1.2 * e : A.type === 17 ? e * A.number : ot(A) ? Ve(A, e) : e;
}, qM = {
  name: "list-style-image",
  initialValue: "none",
  type: 0,
  prefix: !1,
  parse: function(A, e) {
    return e.type === 20 && e.value === "none" ? null : Rp.parse(A, e);
  }
}, zM = {
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
}, Kc = function(A) {
  return {
    name: "margin-" + A,
    initialValue: "0",
    prefix: !1,
    type: 4
    /* TOKEN_VALUE */
  };
}, JM = Kc("top"), jM = Kc("right"), YM = Kc("bottom"), ZM = Kc("left"), AP = {
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
}, eP = {
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
}, Rc = function(A) {
  return {
    name: "padding-" + A,
    initialValue: "0",
    prefix: !1,
    type: 3,
    format: "length-percentage"
  };
}, tP = Rc("top"), nP = Rc("right"), rP = Rc("bottom"), iP = Rc("left"), aP = {
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
}, oP = {
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
}, sP = {
  name: "text-shadow",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(A, e) {
    return e.length === 1 && yd(e[0], "none") ? [] : fr(e).map(function(t) {
      for (var n = {
        color: Pr.TRANSPARENT,
        offsetX: Qt,
        offsetY: Qt,
        blur: Qt
      }, i = 0, s = 0; s < t.length; s++) {
        var l = t[s];
        yi(l) ? (i === 0 ? n.offsetX = l : i === 1 ? n.offsetY = l : n.blur = l, i++) : n.color = mi.parse(A, l);
      }
      return n;
    });
  }
}, uP = {
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
}, lP = {
  name: "transform",
  initialValue: "none",
  prefix: !0,
  type: 0,
  parse: function(A, e) {
    if (e.type === 20 && e.value === "none")
      return null;
    if (e.type === 18) {
      var t = hP[e.name];
      if (typeof t > "u")
        throw new Error('Attempting to parse an unsupported transform function "' + e.name + '"');
      return t(e.values);
    }
    return null;
  }
}, cP = function(A) {
  var e = A.filter(function(t) {
    return t.type === 17;
  }).map(function(t) {
    return t.number;
  });
  return e.length === 6 ? e : null;
}, fP = function(A) {
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
}, hP = {
  matrix: cP,
  matrix3d: fP
}, gm = {
  type: 16,
  number: 50,
  flags: Rs
}, dP = [gm, gm], pP = {
  name: "transform-origin",
  initialValue: "50% 50%",
  prefix: !0,
  type: 1,
  parse: function(A, e) {
    var t = e.filter(ot);
    return t.length !== 2 ? dP : [t[0], t[1]];
  }
}, gP = {
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
var BP = {
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
}, wP = {
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
}, sy = {
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
}, mP = {
  name: "opacity",
  initialValue: "1",
  type: 0,
  prefix: !1,
  parse: function(A, e) {
    return lo(e) ? e.number : 1;
  }
}, vP = {
  name: "text-decoration-color",
  initialValue: "transparent",
  prefix: !1,
  type: 3,
  format: "color"
}, yP = {
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
}, CP = {
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
}, QP = {
  name: "font-size",
  initialValue: "0",
  prefix: !1,
  type: 3,
  format: "length"
}, FP = {
  name: "font-weight",
  initialValue: "normal",
  type: 0,
  prefix: !1,
  parse: function(A, e) {
    if (lo(e))
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
}, UP = {
  name: "font-variant",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(A, e) {
    return e.filter(Re).map(function(t) {
      return t.value;
    });
  }
}, bP = {
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
}, ct = function(A, e) {
  return (A & e) !== 0;
}, EP = {
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
}, _P = {
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
    for (var n = [], i = e.filter(V0), s = 0; s < i.length; s++) {
      var l = i[s], f = i[s + 1];
      if (l.type === 20) {
        var c = f && lo(f) ? f.number : 1;
        n.push({ counter: l.value, increment: c });
      }
    }
    return n;
  }
}, xP = {
  name: "counter-reset",
  initialValue: "none",
  prefix: !0,
  type: 1,
  parse: function(A, e) {
    if (e.length === 0)
      return [];
    for (var t = [], n = e.filter(V0), i = 0; i < n.length; i++) {
      var s = n[i], l = n[i + 1];
      if (Re(s) && s.value !== "none") {
        var f = l && lo(l) ? l.number : 0;
        t.push({ counter: s.value, reset: f });
      }
    }
    return t;
  }
}, IP = {
  name: "duration",
  initialValue: "0s",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return e.filter(ks).map(function(t) {
      return sy.parse(A, t);
    });
  }
}, HP = {
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
    var n = [], i = e.filter(nM);
    if (i.length % 2 !== 0)
      return null;
    for (var s = 0; s < i.length; s += 2) {
      var l = i[s].value, f = i[s + 1].value;
      n.push({ open: l, close: f });
    }
    return n;
  }
}, Bm = function(A, e, t) {
  if (!A)
    return "";
  var n = A[Math.min(e, A.length - 1)];
  return n ? t ? n.open : n.close : "";
}, SP = {
  name: "box-shadow",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(A, e) {
    return e.length === 1 && yd(e[0], "none") ? [] : fr(e).map(function(t) {
      for (var n = {
        color: 255,
        offsetX: Qt,
        offsetY: Qt,
        blur: Qt,
        spread: Qt,
        inset: !1
      }, i = 0, s = 0; s < t.length; s++) {
        var l = t[s];
        yd(l, "inset") ? n.inset = !0 : yi(l) ? (i === 0 ? n.offsetX = l : i === 1 ? n.offsetY = l : i === 2 ? n.blur = l : n.spread = l, i++) : n.color = mi.parse(A, l);
      }
      return n;
    });
  }
}, LP = {
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
}, TP = {
  name: "-webkit-text-stroke-color",
  initialValue: "currentcolor",
  prefix: !1,
  type: 3,
  format: "color"
}, DP = {
  name: "-webkit-text-stroke-width",
  initialValue: "0",
  type: 0,
  prefix: !1,
  parse: function(A, e) {
    return ks(e) ? e.number : 0;
  }
}, OP = (
  /** @class */
  function() {
    function A(e, t) {
      var n, i;
      this.animationDuration = KA(e, IP, t.animationDuration), this.backgroundClip = KA(e, aM, t.backgroundClip), this.backgroundColor = KA(e, oM, t.backgroundColor), this.backgroundImage = KA(e, BM, t.backgroundImage), this.backgroundOrigin = KA(e, wM, t.backgroundOrigin), this.backgroundPosition = KA(e, mM, t.backgroundPosition), this.backgroundRepeat = KA(e, vM, t.backgroundRepeat), this.backgroundSize = KA(e, CM, t.backgroundSize), this.borderTopColor = KA(e, FM, t.borderTopColor), this.borderRightColor = KA(e, UM, t.borderRightColor), this.borderBottomColor = KA(e, bM, t.borderBottomColor), this.borderLeftColor = KA(e, EM, t.borderLeftColor), this.borderTopLeftRadius = KA(e, _M, t.borderTopLeftRadius), this.borderTopRightRadius = KA(e, xM, t.borderTopRightRadius), this.borderBottomRightRadius = KA(e, IM, t.borderBottomRightRadius), this.borderBottomLeftRadius = KA(e, HM, t.borderBottomLeftRadius), this.borderTopStyle = KA(e, SM, t.borderTopStyle), this.borderRightStyle = KA(e, LM, t.borderRightStyle), this.borderBottomStyle = KA(e, TM, t.borderBottomStyle), this.borderLeftStyle = KA(e, DM, t.borderLeftStyle), this.borderTopWidth = KA(e, OM, t.borderTopWidth), this.borderRightWidth = KA(e, NM, t.borderRightWidth), this.borderBottomWidth = KA(e, MM, t.borderBottomWidth), this.borderLeftWidth = KA(e, PM, t.borderLeftWidth), this.boxShadow = KA(e, SP, t.boxShadow), this.color = KA(e, KM, t.color), this.direction = KA(e, RM, t.direction), this.display = KA(e, kM, t.display), this.float = KA(e, GM, t.cssFloat), this.fontFamily = KA(e, CP, t.fontFamily), this.fontSize = KA(e, QP, t.fontSize), this.fontStyle = KA(e, bP, t.fontStyle), this.fontVariant = KA(e, UP, t.fontVariant), this.fontWeight = KA(e, FP, t.fontWeight), this.letterSpacing = KA(e, VM, t.letterSpacing), this.lineBreak = KA(e, WM, t.lineBreak), this.lineHeight = KA(e, XM, t.lineHeight), this.listStyleImage = KA(e, qM, t.listStyleImage), this.listStylePosition = KA(e, zM, t.listStylePosition), this.listStyleType = KA(e, Cd, t.listStyleType), this.marginTop = KA(e, JM, t.marginTop), this.marginRight = KA(e, jM, t.marginRight), this.marginBottom = KA(e, YM, t.marginBottom), this.marginLeft = KA(e, ZM, t.marginLeft), this.opacity = KA(e, mP, t.opacity);
      var s = KA(e, AP, t.overflow);
      this.overflowX = s[0], this.overflowY = s[s.length > 1 ? 1 : 0], this.overflowWrap = KA(e, eP, t.overflowWrap), this.paddingTop = KA(e, tP, t.paddingTop), this.paddingRight = KA(e, nP, t.paddingRight), this.paddingBottom = KA(e, rP, t.paddingBottom), this.paddingLeft = KA(e, iP, t.paddingLeft), this.paintOrder = KA(e, LP, t.paintOrder), this.position = KA(e, oP, t.position), this.textAlign = KA(e, aP, t.textAlign), this.textDecorationColor = KA(e, vP, (n = t.textDecorationColor) !== null && n !== void 0 ? n : t.color), this.textDecorationLine = KA(e, yP, (i = t.textDecorationLine) !== null && i !== void 0 ? i : t.textDecoration), this.textShadow = KA(e, sP, t.textShadow), this.textTransform = KA(e, uP, t.textTransform), this.transform = KA(e, lP, t.transform), this.transformOrigin = KA(e, pP, t.transformOrigin), this.visibility = KA(e, gP, t.visibility), this.webkitTextStrokeColor = KA(e, TP, t.webkitTextStrokeColor), this.webkitTextStrokeWidth = KA(e, DP, t.webkitTextStrokeWidth), this.wordBreak = KA(e, BP, t.wordBreak), this.zIndex = KA(e, wP, t.zIndex);
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
      return ct(
        this.display,
        4
        /* INLINE */
      ) || ct(
        this.display,
        33554432
        /* INLINE_BLOCK */
      ) || ct(
        this.display,
        268435456
        /* INLINE_FLEX */
      ) || ct(
        this.display,
        536870912
        /* INLINE_GRID */
      ) || ct(
        this.display,
        67108864
        /* INLINE_LIST_ITEM */
      ) || ct(
        this.display,
        134217728
        /* INLINE_TABLE */
      );
    }, A;
  }()
), NP = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t) {
      this.content = KA(e, EP, t.content), this.quotes = KA(e, HP, t.quotes);
    }
    return A;
  }()
), wm = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t) {
      this.counterIncrement = KA(e, _P, t.counterIncrement), this.counterReset = KA(e, xP, t.counterReset);
    }
    return A;
  }()
), KA = function(A, e, t) {
  var n = new $0(), i = t !== null && typeof t < "u" ? t.toString() : e.initialValue;
  n.write(i);
  var s = new G0(n.read());
  switch (e.type) {
    case 2:
      var l = s.parseComponentValue();
      return e.parse(A, Re(l) ? l.value : e.initialValue);
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
          return Rp.parse(A, s.parseComponentValue());
        case "length":
          var f = s.parseComponentValue();
          return yi(f) ? f : Qt;
        case "length-percentage":
          var c = s.parseComponentValue();
          return ot(c) ? c : Qt;
        case "time":
          return sy.parse(A, s.parseComponentValue());
      }
      break;
  }
}, MP = "data-html2canvas-debug", PP = function(A) {
  var e = A.getAttribute(MP);
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
  var t = PP(A);
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
      this.styles = new OP(e, window.getComputedStyle(t, null)), bd(t) && (this.styles.animationDuration.some(function(n) {
        return n > 0;
      }) && (t.style.animationDuration = "0s"), this.styles.transform !== null && (t.style.transform = "none")), this.bounds = Sc(this.context, t), Qd(
        t,
        4
        /* RENDER */
      ) && (this.flags |= 16);
    }
    return A;
  }()
), KP = "AAAAAAAAAAAAEA4AGBkAAFAaAAACAAAAAAAIABAAGAAwADgACAAQAAgAEAAIABAACAAQAAgAEAAIABAACAAQAAgAEAAIABAAQABIAEQATAAIABAACAAQAAgAEAAIABAAVABcAAgAEAAIABAACAAQAGAAaABwAHgAgACIAI4AlgAIABAAmwCjAKgAsAC2AL4AvQDFAMoA0gBPAVYBWgEIAAgACACMANoAYgFkAWwBdAF8AX0BhQGNAZUBlgGeAaMBlQGWAasBswF8AbsBwwF0AcsBYwHTAQgA2wG/AOMBdAF8AekB8QF0AfkB+wHiAHQBfAEIAAMC5gQIAAsCEgIIAAgAFgIeAggAIgIpAggAMQI5AkACygEIAAgASAJQAlgCYAIIAAgACAAKBQoFCgUTBRMFGQUrBSsFCAAIAAgACAAIAAgACAAIAAgACABdAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABoAmgCrwGvAQgAbgJ2AggAHgEIAAgACADnAXsCCAAIAAgAgwIIAAgACAAIAAgACACKAggAkQKZAggAPADJAAgAoQKkAqwCsgK6AsICCADJAggA0AIIAAgACAAIANYC3gIIAAgACAAIAAgACABAAOYCCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAkASoB+QIEAAgACAA8AEMCCABCBQgACABJBVAFCAAIAAgACAAIAAgACAAIAAgACABTBVoFCAAIAFoFCABfBWUFCAAIAAgACAAIAAgAbQUIAAgACAAIAAgACABzBXsFfQWFBYoFigWKBZEFigWKBYoFmAWfBaYFrgWxBbkFCAAIAAgACAAIAAgACAAIAAgACAAIAMEFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAMgFCADQBQgACAAIAAgACAAIAAgACAAIAAgACAAIAO4CCAAIAAgAiQAIAAgACABAAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAD0AggACAD8AggACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIANYFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAMDvwAIAAgAJAIIAAgACAAIAAgACAAIAAgACwMTAwgACAB9BOsEGwMjAwgAKwMyAwsFYgE3A/MEPwMIAEUDTQNRAwgAWQOsAGEDCAAIAAgACAAIAAgACABpAzQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFIQUoBSwFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABtAwgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABMAEwACAAIAAgACAAIABgACAAIAAgACAC/AAgACAAyAQgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACAAIAAwAAgACAAIAAgACAAIAAgACAAIAAAARABIAAgACAAIABQASAAIAAgAIABwAEAAjgCIABsAqAC2AL0AigDQAtwC+IJIQqVAZUBWQqVAZUBlQGVAZUBlQGrC5UBlQGVAZUBlQGVAZUBlQGVAXsKlQGVAbAK6wsrDGUMpQzlDJUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAfAKAAuZA64AtwCJALoC6ADwAAgAuACgA/oEpgO6AqsD+AAIAAgAswMIAAgACAAIAIkAuwP5AfsBwwPLAwgACAAIAAgACADRA9kDCAAIAOED6QMIAAgACAAIAAgACADuA/YDCAAIAP4DyQAIAAgABgQIAAgAXQAOBAgACAAIAAgACAAIABMECAAIAAgACAAIAAgACAD8AAQBCAAIAAgAGgQiBCoECAExBAgAEAEIAAgACAAIAAgACAAIAAgACAAIAAgACAA4BAgACABABEYECAAIAAgATAQYAQgAVAQIAAgACAAIAAgACAAIAAgACAAIAFoECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAOQEIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAB+BAcACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAEABhgSMBAgACAAIAAgAlAQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAwAEAAQABAADAAMAAwADAAQABAAEAAQABAAEAAQABHATAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAdQMIAAgACAAIAAgACAAIAMkACAAIAAgAfQMIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACFA4kDCAAIAAgACAAIAOcBCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAIcDCAAIAAgACAAIAAgACAAIAAgACAAIAJEDCAAIAAgACADFAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABgBAgAZgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAbAQCBXIECAAIAHkECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABAAJwEQACjBKoEsgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAC6BMIECAAIAAgACAAIAAgACABmBAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAxwQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAGYECAAIAAgAzgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBd0FXwUIAOIF6gXxBYoF3gT5BQAGCAaKBYoFigWKBYoFigWKBYoFigWKBYoFigXWBIoFigWKBYoFigWKBYoFigWKBYsFEAaKBYoFigWKBYoFigWKBRQGCACKBYoFigWKBQgACAAIANEECAAIABgGigUgBggAJgYIAC4GMwaKBYoF0wQ3Bj4GigWKBYoFigWKBYoFigWKBYoFigWKBYoFigUIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWLBf///////wQABAAEAAQABAAEAAQABAAEAAQAAwAEAAQAAgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAQADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUAAAAFAAUAAAAFAAUAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAQAAAAUABQAFAAUABQAFAAAAAAAFAAUAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAFAAUAAQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAAABwAHAAcAAAAHAAcABwAFAAEAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAcABwAFAAUAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAQABAAAAAAAAAAAAAAAFAAUABQAFAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAHAAcAAAAHAAcAAAAAAAUABQAHAAUAAQAHAAEABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwABAAUABQAFAAUAAAAAAAAAAAAAAAEAAQABAAEAAQABAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABQANAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAABQAHAAUABQAFAAAAAAAAAAcABQAFAAUABQAFAAQABAAEAAQABAAEAAQABAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUAAAAFAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAUAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAcABwAFAAcABwAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUABwAHAAUABQAFAAUAAAAAAAcABwAAAAAABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAAAAAAAAAAABQAFAAAAAAAFAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAFAAUABQAFAAUAAAAFAAUABwAAAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABwAFAAUABQAFAAAAAAAHAAcAAAAAAAcABwAFAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAAAAAAAAAHAAcABwAAAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAUABQAFAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAHAAcABQAHAAcAAAAFAAcABwAAAAcABwAFAAUAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAFAAcABwAFAAUABQAAAAUAAAAHAAcABwAHAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAHAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUAAAAFAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAUAAAAFAAUAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABwAFAAUABQAFAAUABQAAAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABQAFAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAFAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAHAAUABQAFAAUABQAFAAUABwAHAAcABwAHAAcABwAHAAUABwAHAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABwAHAAcABwAFAAUABwAHAAcAAAAAAAAAAAAHAAcABQAHAAcABwAHAAcABwAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAUABQAFAAUABQAFAAUAAAAFAAAABQAAAAAABQAFAAUABQAFAAUABQAFAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAUABQAFAAUABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABwAFAAcABwAHAAcABwAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAUABQAFAAUABwAHAAUABQAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABQAFAAcABwAHAAUABwAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAcABQAFAAUABQAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAAAAAABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAAAAAAAAAFAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAUABQAHAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAFAAUABQAFAAcABwAFAAUABwAHAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAcABwAFAAUABwAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABQAAAAAABQAFAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAcABwAAAAAAAAAAAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAcABwAFAAcABwAAAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAFAAUABQAAAAUABQAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABwAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAHAAcABQAHAAUABQAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAAABwAHAAAAAAAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAFAAUABwAFAAcABwAFAAcABQAFAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAAAAAABwAHAAcABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAFAAcABwAFAAUABQAFAAUABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAUABQAFAAcABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABQAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAAAAAAFAAUABwAHAAcABwAFAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAHAAUABQAFAAUABQAFAAUABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAABQAAAAUABQAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAHAAcAAAAFAAUAAAAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABQAFAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAABQAFAAUABQAFAAUABQAAAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAFAAUABQAFAAUADgAOAA4ADgAOAA4ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAMAAwADAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAAAAAAAAAAAAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAAAAAAAAAAAAsADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwACwAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAADgAOAA4AAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAAAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4AAAAOAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAAAAAAAAAAAA4AAAAOAAAAAAAAAAAADgAOAA4AAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAA=", mm = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", os = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var bl = 0; bl < mm.length; bl++)
  os[mm.charCodeAt(bl)] = bl;
var RP = function(A) {
  var e = A.length * 0.75, t = A.length, n, i = 0, s, l, f, c;
  A[A.length - 1] === "=" && (e--, A[A.length - 2] === "=" && e--);
  var h = typeof ArrayBuffer < "u" && typeof Uint8Array < "u" && typeof Uint8Array.prototype.slice < "u" ? new ArrayBuffer(e) : new Array(e), w = Array.isArray(h) ? h : new Uint8Array(h);
  for (n = 0; n < t; n += 4)
    s = os[A.charCodeAt(n)], l = os[A.charCodeAt(n + 1)], f = os[A.charCodeAt(n + 2)], c = os[A.charCodeAt(n + 3)], w[i++] = s << 2 | l >> 4, w[i++] = (l & 15) << 4 | f >> 2, w[i++] = (f & 3) << 6 | c & 63;
  return h;
}, kP = function(A) {
  for (var e = A.length, t = [], n = 0; n < e; n += 2)
    t.push(A[n + 1] << 8 | A[n]);
  return t;
}, $P = function(A) {
  for (var e = A.length, t = [], n = 0; n < e; n += 4)
    t.push(A[n + 3] << 24 | A[n + 2] << 16 | A[n + 1] << 8 | A[n]);
  return t;
}, ea = 5, kp = 11, Ch = 2, GP = kp - ea, uy = 65536 >> ea, VP = 1 << ea, Qh = VP - 1, WP = 1024 >> ea, XP = uy + WP, qP = XP, zP = 32, JP = qP + zP, jP = 65536 >> kp, YP = 1 << GP, ZP = YP - 1, vm = function(A, e, t) {
  return A.slice ? A.slice(e, t) : new Uint16Array(Array.prototype.slice.call(A, e, t));
}, AK = function(A, e, t) {
  return A.slice ? A.slice(e, t) : new Uint32Array(Array.prototype.slice.call(A, e, t));
}, eK = function(A, e) {
  var t = RP(A), n = Array.isArray(t) ? $P(t) : new Uint32Array(t), i = Array.isArray(t) ? kP(t) : new Uint16Array(t), s = 24, l = vm(i, s / 2, n[4] / 2), f = n[5] === 2 ? vm(i, (s + n[4]) / 2) : AK(n, Math.ceil((s + n[4]) / 4));
  return new tK(n[0], n[1], n[2], n[3], l, f);
}, tK = (
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
          return t = this.index[uy + (e - 55296 >> ea)], t = (t << Ch) + (e & Qh), this.data[t];
        if (e < this.highStart)
          return t = JP - jP + (e >> kp), t = this.index[t], t += e >> ea & ZP, t = this.index[t], t = (t << Ch) + (e & Qh), this.data[t];
        if (e <= 1114111)
          return this.data[this.highValueIndex];
      }
      return this.errorValue;
    }, A;
  }()
), ym = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", nK = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var El = 0; El < ym.length; El++)
  nK[ym.charCodeAt(El)] = El;
var rK = 1, Fh = 2, Uh = 3, Cm = 4, Qm = 5, iK = 7, Fm = 8, bh = 9, Eh = 10, Um = 11, bm = 12, Em = 13, _m = 14, _h = 15, aK = function(A) {
  for (var e = [], t = 0, n = A.length; t < n; ) {
    var i = A.charCodeAt(t++);
    if (i >= 55296 && i <= 56319 && t < n) {
      var s = A.charCodeAt(t++);
      (s & 64512) === 56320 ? e.push(((i & 1023) << 10) + (s & 1023) + 65536) : (e.push(i), t--);
    } else
      e.push(i);
  }
  return e;
}, oK = function() {
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
}, sK = eK(KP), Bn = "×", xh = "÷", uK = function(A) {
  return sK.get(A);
}, lK = function(A, e, t) {
  var n = t - 2, i = e[n], s = e[t - 1], l = e[t];
  if (s === Fh && l === Uh)
    return Bn;
  if (s === Fh || s === Uh || s === Cm || l === Fh || l === Uh || l === Cm)
    return xh;
  if (s === Fm && [Fm, bh, Um, bm].indexOf(l) !== -1 || (s === Um || s === bh) && (l === bh || l === Eh) || (s === bm || s === Eh) && l === Eh || l === Em || l === Qm || l === iK || s === rK)
    return Bn;
  if (s === Em && l === _m) {
    for (; i === Qm; )
      i = e[--n];
    if (i === _m)
      return Bn;
  }
  if (s === _h && l === _h) {
    for (var f = 0; i === _h; )
      f++, i = e[--n];
    if (f % 2 === 0)
      return Bn;
  }
  return xh;
}, cK = function(A) {
  var e = aK(A), t = e.length, n = 0, i = 0, s = e.map(uK);
  return {
    next: function() {
      if (n >= t)
        return { done: !0, value: null };
      for (var l = Bn; n < t && (l = lK(e, s, ++n)) === Bn; )
        ;
      if (l !== Bn || n === t) {
        var f = oK.apply(null, e.slice(i, n));
        return i = n, { value: f, done: !1 };
      }
      return { done: !0, value: null };
    }
  };
}, fK = function(A) {
  for (var e = cK(A), t = [], n; !(n = e.next()).done; )
    n.value && t.push(n.value.slice());
  return t;
}, hK = function(A) {
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
}, dK = function(A) {
  var e = A.createElement("boundtest");
  e.style.width = "50px", e.style.display = "block", e.style.fontSize = "12px", e.style.letterSpacing = "0px", e.style.wordSpacing = "0px", A.body.appendChild(e);
  var t = A.createRange();
  e.innerHTML = typeof "".repeat == "function" ? "&#128104;".repeat(10) : "";
  var n = e.firstChild, i = Lc(n.data).map(function(c) {
    return it(c);
  }), s = 0, l = {}, f = i.every(function(c, h) {
    t.setStart(n, s), t.setEnd(n, s + c.length);
    var w = t.getBoundingClientRect();
    s += c.length;
    var B = w.x > l.x || w.y > l.y;
    return l = w, h === 0 ? !0 : B;
  });
  return A.body.removeChild(e), f;
}, pK = function() {
  return typeof new Image().crossOrigin < "u";
}, gK = function() {
  return typeof new XMLHttpRequest().responseType == "string";
}, BK = function(A) {
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
}, xm = function(A) {
  return A[0] === 0 && A[1] === 255 && A[2] === 0 && A[3] === 255;
}, wK = function(A) {
  var e = A.createElement("canvas"), t = 100;
  e.width = t, e.height = t;
  var n = e.getContext("2d");
  if (!n)
    return Promise.reject(!1);
  n.fillStyle = "rgb(0, 255, 0)", n.fillRect(0, 0, t, t);
  var i = new Image(), s = e.toDataURL();
  i.src = s;
  var l = Fd(t, t, 0, 0, i);
  return n.fillStyle = "red", n.fillRect(0, 0, t, t), Im(l).then(function(f) {
    n.drawImage(f, 0, 0);
    var c = n.getImageData(0, 0, t, t).data;
    n.fillStyle = "red", n.fillRect(0, 0, t, t);
    var h = A.createElement("div");
    return h.style.backgroundImage = "url(" + s + ")", h.style.height = t + "px", xm(c) ? Im(Fd(t, t, 0, 0, h)) : Promise.reject(!1);
  }).then(function(f) {
    return n.drawImage(f, 0, 0), xm(n.getImageData(0, 0, t, t).data);
  }).catch(function() {
    return !1;
  });
}, Fd = function(A, e, t, n, i) {
  var s = "http://www.w3.org/2000/svg", l = document.createElementNS(s, "svg"), f = document.createElementNS(s, "foreignObject");
  return l.setAttributeNS(null, "width", A.toString()), l.setAttributeNS(null, "height", e.toString()), f.setAttributeNS(null, "width", "100%"), f.setAttributeNS(null, "height", "100%"), f.setAttributeNS(null, "x", t.toString()), f.setAttributeNS(null, "y", n.toString()), f.setAttributeNS(null, "externalResourcesRequired", "true"), l.appendChild(f), f.appendChild(i), l;
}, Im = function(A) {
  return new Promise(function(e, t) {
    var n = new Image();
    n.onload = function() {
      return e(n);
    }, n.onerror = t, n.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(A));
  });
}, yt = {
  get SUPPORT_RANGE_BOUNDS() {
    var A = hK(document);
    return Object.defineProperty(yt, "SUPPORT_RANGE_BOUNDS", { value: A }), A;
  },
  get SUPPORT_WORD_BREAKING() {
    var A = yt.SUPPORT_RANGE_BOUNDS && dK(document);
    return Object.defineProperty(yt, "SUPPORT_WORD_BREAKING", { value: A }), A;
  },
  get SUPPORT_SVG_DRAWING() {
    var A = BK(document);
    return Object.defineProperty(yt, "SUPPORT_SVG_DRAWING", { value: A }), A;
  },
  get SUPPORT_FOREIGNOBJECT_DRAWING() {
    var A = typeof Array.from == "function" && typeof window.fetch == "function" ? wK(document) : Promise.resolve(!1);
    return Object.defineProperty(yt, "SUPPORT_FOREIGNOBJECT_DRAWING", { value: A }), A;
  },
  get SUPPORT_CORS_IMAGES() {
    var A = pK();
    return Object.defineProperty(yt, "SUPPORT_CORS_IMAGES", { value: A }), A;
  },
  get SUPPORT_RESPONSE_TYPE() {
    var A = gK();
    return Object.defineProperty(yt, "SUPPORT_RESPONSE_TYPE", { value: A }), A;
  },
  get SUPPORT_CORS_XHR() {
    var A = "withCredentials" in new XMLHttpRequest();
    return Object.defineProperty(yt, "SUPPORT_CORS_XHR", { value: A }), A;
  },
  get SUPPORT_NATIVE_TEXT_SEGMENTATION() {
    var A = !!(typeof Intl < "u" && Intl.Segmenter);
    return Object.defineProperty(yt, "SUPPORT_NATIVE_TEXT_SEGMENTATION", { value: A }), A;
  }
}, ms = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t) {
      this.text = e, this.bounds = t;
    }
    return A;
  }()
), mK = function(A, e, t, n) {
  var i = CK(e, t), s = [], l = 0;
  return i.forEach(function(f) {
    if (t.textDecorationLine.length || f.trim().length > 0)
      if (yt.SUPPORT_RANGE_BOUNDS) {
        var c = Hm(n, l, f.length).getClientRects();
        if (c.length > 1) {
          var h = $p(f), w = 0;
          h.forEach(function(p) {
            s.push(new ms(p, $r.fromDOMRectList(A, Hm(n, w + l, p.length).getClientRects()))), w += p.length;
          });
        } else
          s.push(new ms(f, $r.fromDOMRectList(A, c)));
      } else {
        var B = n.splitText(f.length);
        s.push(new ms(f, vK(A, n))), n = B;
      }
    else yt.SUPPORT_RANGE_BOUNDS || (n = n.splitText(f.length));
    l += f.length;
  }), s;
}, vK = function(A, e) {
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
}, Hm = function(A, e, t) {
  var n = A.ownerDocument;
  if (!n)
    throw new Error("Node has no owner document");
  var i = n.createRange();
  return i.setStart(A, e), i.setEnd(A, e + t), i;
}, $p = function(A) {
  if (yt.SUPPORT_NATIVE_TEXT_SEGMENTATION) {
    var e = new Intl.Segmenter(void 0, { granularity: "grapheme" });
    return Array.from(e.segment(A)).map(function(t) {
      return t.segment;
    });
  }
  return fK(A);
}, yK = function(A, e) {
  if (yt.SUPPORT_NATIVE_TEXT_SEGMENTATION) {
    var t = new Intl.Segmenter(void 0, {
      granularity: "word"
    });
    return Array.from(t.segment(A)).map(function(n) {
      return n.segment;
    });
  }
  return FK(A, e);
}, CK = function(A, e) {
  return e.letterSpacing !== 0 ? $p(A) : yK(A, e);
}, QK = [32, 160, 4961, 65792, 65793, 4153, 4241], FK = function(A, e) {
  for (var t = j4(A, {
    lineBreak: e.lineBreak,
    wordBreak: e.overflowWrap === "break-word" ? "break-word" : e.wordBreak
  }), n = [], i, s = function() {
    if (i.value) {
      var l = i.value.slice(), f = Lc(l), c = "";
      f.forEach(function(h) {
        QK.indexOf(h) === -1 ? c += it(h) : (c.length && n.push(c), n.push(it(h)), c = "");
      }), c.length && n.push(c);
    }
  }; !(i = t.next()).done; )
    s();
  return n;
}, UK = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t, n) {
      this.text = bK(t.data, n.textTransform), this.textBounds = mK(e, this.text, n, t);
    }
    return A;
  }()
), bK = function(A, e) {
  switch (e) {
    case 1:
      return A.toLowerCase();
    case 3:
      return A.replace(EK, _K);
    case 2:
      return A.toUpperCase();
    default:
      return A;
  }
}, EK = /(^|\s|:|-|\(|\))([a-z])/g, _K = function(A, e, t) {
  return A.length > 0 ? e + t.toUpperCase() : A;
}, ly = (
  /** @class */
  function(A) {
    Xn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i.src = n.currentSrc || n.src, i.intrinsicWidth = n.naturalWidth, i.intrinsicHeight = n.naturalHeight, i.context.cache.addImage(i.src), i;
    }
    return e;
  }(hr)
), cy = (
  /** @class */
  function(A) {
    Xn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i.canvas = n, i.intrinsicWidth = n.width, i.intrinsicHeight = n.height, i;
    }
    return e;
  }(hr)
), fy = (
  /** @class */
  function(A) {
    Xn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this, s = new XMLSerializer(), l = Sc(t, n);
      return n.setAttribute("width", l.width + "px"), n.setAttribute("height", l.height + "px"), i.svg = "data:image/svg+xml," + encodeURIComponent(s.serializeToString(n)), i.intrinsicWidth = n.width.baseVal.value, i.intrinsicHeight = n.height.baseVal.value, i.context.cache.addImage(i.svg), i;
    }
    return e;
  }(hr)
), hy = (
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
), xK = [
  {
    type: 15,
    flags: 0,
    unit: "px",
    number: 3
  }
], IK = [
  {
    type: 16,
    flags: 0,
    number: 50
  }
], HK = function(A) {
  return A.width > A.height ? new $r(A.left + (A.width - A.height) / 2, A.top, A.height, A.height) : A.width < A.height ? new $r(A.left, A.top + (A.height - A.width) / 2, A.width, A.width) : A;
}, SK = function(A) {
  var e = A.type === LK ? new Array(A.value.length + 1).join("•") : A.value;
  return e.length === 0 ? A.placeholder || "" : e;
}, hc = "checkbox", dc = "radio", LK = "password", Sm = 707406591, Gp = (
  /** @class */
  function(A) {
    Xn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      switch (i.type = n.type.toLowerCase(), i.checked = n.checked, i.value = SK(n), (i.type === hc || i.type === dc) && (i.styles.backgroundColor = 3739148031, i.styles.borderTopColor = i.styles.borderRightColor = i.styles.borderBottomColor = i.styles.borderLeftColor = 2779096575, i.styles.borderTopWidth = i.styles.borderRightWidth = i.styles.borderBottomWidth = i.styles.borderLeftWidth = 1, i.styles.borderTopStyle = i.styles.borderRightStyle = i.styles.borderBottomStyle = i.styles.borderLeftStyle = 1, i.styles.backgroundClip = [
        0
        /* BORDER_BOX */
      ], i.styles.backgroundOrigin = [
        0
        /* BORDER_BOX */
      ], i.bounds = HK(i.bounds)), i.type) {
        case hc:
          i.styles.borderTopRightRadius = i.styles.borderTopLeftRadius = i.styles.borderBottomRightRadius = i.styles.borderBottomLeftRadius = xK;
          break;
        case dc:
          i.styles.borderTopRightRadius = i.styles.borderTopLeftRadius = i.styles.borderBottomRightRadius = i.styles.borderBottomLeftRadius = IK;
          break;
      }
      return i;
    }
    return e;
  }(hr)
), dy = (
  /** @class */
  function(A) {
    Xn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this, s = n.options[n.selectedIndex || 0];
      return i.value = s && s.text || "", i;
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
), gy = (
  /** @class */
  function(A) {
    Xn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      i.src = n.src, i.width = parseInt(n.width, 10) || 0, i.height = parseInt(n.height, 10) || 0, i.backgroundColor = i.styles.backgroundColor;
      try {
        if (n.contentWindow && n.contentWindow.document && n.contentWindow.document.documentElement) {
          i.tree = wy(t, n.contentWindow.document.documentElement);
          var s = n.contentWindow.document.documentElement ? Bs(t, getComputedStyle(n.contentWindow.document.documentElement).backgroundColor) : Pr.TRANSPARENT, l = n.contentWindow.document.body ? Bs(t, getComputedStyle(n.contentWindow.document.body).backgroundColor) : Pr.TRANSPARENT;
          i.backgroundColor = vi(s) ? vi(l) ? i.styles.backgroundColor : l : s;
        }
      } catch {
      }
      return i;
    }
    return e;
  }(hr)
), TK = ["OL", "UL", "MENU"], Vl = function(A, e, t, n) {
  for (var i = e.firstChild, s = void 0; i; i = s)
    if (s = i.nextSibling, my(i) && i.data.trim().length > 0)
      t.textNodes.push(new UK(A, i, t.styles));
    else if (Va(i))
      if (Qy(i) && i.assignedNodes)
        i.assignedNodes().forEach(function(f) {
          return Vl(A, f, t, n);
        });
      else {
        var l = By(A, i);
        l.styles.isVisible() && (DK(i, l, n) ? l.flags |= 4 : OK(l.styles) && (l.flags |= 2), TK.indexOf(i.tagName) !== -1 && (l.flags |= 8), t.elements.push(l), i.slot, i.shadowRoot ? Vl(A, i.shadowRoot, l, n) : !pc(i) && !vy(i) && !gc(i) && Vl(A, i, l, n));
      }
}, By = function(A, e) {
  return Ed(e) ? new ly(A, e) : yy(e) ? new cy(A, e) : vy(e) ? new fy(A, e) : NK(e) ? new hy(A, e) : MK(e) ? new Ud(A, e) : PK(e) ? new Gp(A, e) : gc(e) ? new dy(A, e) : pc(e) ? new py(A, e) : Cy(e) ? new gy(A, e) : new hr(A, e);
}, wy = function(A, e) {
  var t = By(A, e);
  return t.flags |= 4, Vl(A, e, t, t), t;
}, DK = function(A, e, t) {
  return e.styles.isPositionedWithZIndex() || e.styles.opacity < 1 || e.styles.isTransformed() || Vp(A) && t.styles.isTransparent();
}, OK = function(A) {
  return A.isPositioned() || A.isFloating();
}, my = function(A) {
  return A.nodeType === Node.TEXT_NODE;
}, Va = function(A) {
  return A.nodeType === Node.ELEMENT_NODE;
}, bd = function(A) {
  return Va(A) && typeof A.style < "u" && !Wl(A);
}, Wl = function(A) {
  return typeof A.className == "object";
}, NK = function(A) {
  return A.tagName === "LI";
}, MK = function(A) {
  return A.tagName === "OL";
}, PK = function(A) {
  return A.tagName === "INPUT";
}, KK = function(A) {
  return A.tagName === "HTML";
}, vy = function(A) {
  return A.tagName === "svg";
}, Vp = function(A) {
  return A.tagName === "BODY";
}, yy = function(A) {
  return A.tagName === "CANVAS";
}, Lm = function(A) {
  return A.tagName === "VIDEO";
}, Ed = function(A) {
  return A.tagName === "IMG";
}, Cy = function(A) {
  return A.tagName === "IFRAME";
}, Tm = function(A) {
  return A.tagName === "STYLE";
}, RK = function(A) {
  return A.tagName === "SCRIPT";
}, pc = function(A) {
  return A.tagName === "TEXTAREA";
}, gc = function(A) {
  return A.tagName === "SELECT";
}, Qy = function(A) {
  return A.tagName === "SLOT";
}, Dm = function(A) {
  return A.tagName.indexOf("-") > 0;
}, kK = (
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
), Om = {
  integers: [1e3, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
  values: ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
}, Nm = {
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
}, $K = {
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
}, GK = {
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
  return A < e || A > t ? Ss(A, i, s.length > 0) : n.integers.reduce(function(l, f, c) {
    for (; A >= f; )
      A -= f, l += n.values[c];
    return l;
  }, "") + s;
}, Fy = function(A, e, t, n) {
  var i = "";
  do
    t || A--, i = n(A) + i, A /= e;
  while (A * e >= e);
  return i;
}, nt = function(A, e, t, n, i) {
  var s = t - e + 1;
  return (A < 0 ? "-" : "") + (Fy(Math.abs(A), s, n, function(l) {
    return it(Math.floor(l % s) + e);
  }) + i);
}, $i = function(A, e, t) {
  t === void 0 && (t = ". ");
  var n = e.length;
  return Fy(Math.abs(A), n, !1, function(i) {
    return e[Math.floor(i % n)];
  }) + t;
}, ka = 1, ci = 2, fi = 4, ss = 8, Or = function(A, e, t, n, i, s) {
  if (A < -9999 || A > 9999)
    return Ss(A, 4, i.length > 0);
  var l = Math.abs(A), f = i;
  if (l === 0)
    return e[0] + f;
  for (var c = 0; l > 0 && c <= 4; c++) {
    var h = l % 10;
    h === 0 && ct(s, ka) && f !== "" ? f = e[h] + f : h > 1 || h === 1 && c === 0 || h === 1 && c === 1 && ct(s, ci) || h === 1 && c === 1 && ct(s, fi) && A > 100 || h === 1 && c > 1 && ct(s, ss) ? f = e[h] + (c > 0 ? t[c - 1] : "") + f : h === 1 && c > 0 && (f = t[c - 1] + f), l = Math.floor(l / 10);
  }
  return (A < 0 ? n : "") + f;
}, Mm = "十百千萬", Pm = "拾佰仟萬", Km = "マイナス", Ih = "마이너스", Ss = function(A, e, t) {
  var n = t ? ". " : "", i = t ? "、" : "", s = t ? ", " : "", l = t ? " " : "";
  switch (e) {
    case 0:
      return "•" + l;
    case 1:
      return "◦" + l;
    case 2:
      return "◾" + l;
    case 5:
      var f = nt(A, 48, 57, !0, n);
      return f.length < 4 ? "0" + f : f;
    case 4:
      return $i(A, "〇一二三四五六七八九", i);
    case 6:
      return Na(A, 1, 3999, Om, 3, n).toLowerCase();
    case 7:
      return Na(A, 1, 3999, Om, 3, n);
    case 8:
      return nt(A, 945, 969, !1, n);
    case 9:
      return nt(A, 97, 122, !1, n);
    case 10:
      return nt(A, 65, 90, !1, n);
    case 11:
      return nt(A, 1632, 1641, !0, n);
    case 12:
    case 49:
      return Na(A, 1, 9999, Nm, 3, n);
    case 35:
      return Na(A, 1, 9999, Nm, 3, n).toLowerCase();
    case 13:
      return nt(A, 2534, 2543, !0, n);
    case 14:
    case 30:
      return nt(A, 6112, 6121, !0, n);
    case 15:
      return $i(A, "子丑寅卯辰巳午未申酉戌亥", i);
    case 16:
      return $i(A, "甲乙丙丁戊己庚辛壬癸", i);
    case 17:
    case 48:
      return Or(A, "零一二三四五六七八九", Mm, "負", i, ci | fi | ss);
    case 47:
      return Or(A, "零壹貳參肆伍陸柒捌玖", Pm, "負", i, ka | ci | fi | ss);
    case 42:
      return Or(A, "零一二三四五六七八九", Mm, "负", i, ci | fi | ss);
    case 41:
      return Or(A, "零壹贰叁肆伍陆柒捌玖", Pm, "负", i, ka | ci | fi | ss);
    case 26:
      return Or(A, "〇一二三四五六七八九", "十百千万", Km, i, 0);
    case 25:
      return Or(A, "零壱弐参四伍六七八九", "拾百千万", Km, i, ka | ci | fi);
    case 31:
      return Or(A, "영일이삼사오육칠팔구", "십백천만", Ih, s, ka | ci | fi);
    case 33:
      return Or(A, "零一二三四五六七八九", "十百千萬", Ih, s, 0);
    case 32:
      return Or(A, "零壹貳參四五六七八九", "拾百千", Ih, s, ka | ci | fi);
    case 18:
      return nt(A, 2406, 2415, !0, n);
    case 20:
      return Na(A, 1, 19999, GK, 3, n);
    case 21:
      return nt(A, 2790, 2799, !0, n);
    case 22:
      return nt(A, 2662, 2671, !0, n);
    case 22:
      return Na(A, 1, 10999, $K, 3, n);
    case 23:
      return $i(A, "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわゐゑをん");
    case 24:
      return $i(A, "いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこえてあさきゆめみしゑひもせす");
    case 27:
      return nt(A, 3302, 3311, !0, n);
    case 28:
      return $i(A, "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン", i);
    case 29:
      return $i(A, "イロハニホヘトチリヌルヲワカヨタレソツネナラムウヰノオクヤマケフコエテアサキユメミシヱヒモセス", i);
    case 34:
      return nt(A, 3792, 3801, !0, n);
    case 37:
      return nt(A, 6160, 6169, !0, n);
    case 38:
      return nt(A, 4160, 4169, !0, n);
    case 39:
      return nt(A, 2918, 2927, !0, n);
    case 40:
      return nt(A, 1776, 1785, !0, n);
    case 43:
      return nt(A, 3046, 3055, !0, n);
    case 44:
      return nt(A, 3174, 3183, !0, n);
    case 45:
      return nt(A, 3664, 3673, !0, n);
    case 46:
      return nt(A, 3872, 3881, !0, n);
    case 3:
    default:
      return nt(A, 48, 57, !0, n);
  }
}, Uy = "data-html2canvas-ignore", Rm = (
  /** @class */
  function() {
    function A(e, t, n) {
      if (this.context = e, this.options = n, this.scrolledElements = [], this.referenceElement = t, this.counters = new kK(), this.quoteDepth = 0, !t.ownerDocument)
        throw new Error("Cloned element does not have an owner document");
      this.documentElement = this.cloneNode(t.ownerDocument.documentElement, !1);
    }
    return A.prototype.toIFrame = function(e, t) {
      var n = this, i = VK(e, t);
      if (!i.contentWindow)
        return Promise.reject("Unable to find iframe window");
      var s = e.defaultView.pageXOffset, l = e.defaultView.pageYOffset, f = i.contentWindow, c = f.document, h = qK(i).then(function() {
        return kt(n, void 0, void 0, function() {
          var w, B;
          return Lt(this, function(p) {
            switch (p.label) {
              case 0:
                return this.scrolledElements.forEach(YK), f && (f.scrollTo(t.left, t.top), /(iPad|iPhone|iPod)/g.test(navigator.userAgent) && (f.scrollY !== t.top || f.scrollX !== t.left) && (this.context.logger.warn("Unable to restore scroll position for cloned document"), this.context.windowBounds = this.context.windowBounds.add(f.scrollX - t.left, f.scrollY - t.top, 0, 0))), w = this.options.onclone, B = this.clonedReferenceElement, typeof B > "u" ? [2, Promise.reject("Error finding the " + this.referenceElement.nodeName + " in the cloned document")] : c.fonts && c.fonts.ready ? [4, c.fonts.ready] : [3, 2];
              case 1:
                p.sent(), p.label = 2;
              case 2:
                return /(AppleWebKit)/g.test(navigator.userAgent) ? [4, XK(c)] : [3, 4];
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
      return c.open(), c.write(JK(document.doctype) + "<html></html>"), jK(this.referenceElement.ownerDocument, s, l), c.replaceChild(c.adoptNode(this.documentElement), c.documentElement), c.close(), h;
    }, A.prototype.createElementClone = function(e) {
      if (Qd(
        e,
        2
        /* CLONE */
      ))
        debugger;
      if (yy(e))
        return this.createCanvasClone(e);
      if (Lm(e))
        return this.createVideoClone(e);
      if (Tm(e))
        return this.createStyleClone(e);
      var t = e.cloneNode(!1);
      return Ed(t) && (Ed(e) && e.currentSrc && e.currentSrc !== e.src && (t.src = e.currentSrc, t.srcset = ""), t.loading === "lazy" && (t.loading = "eager")), Dm(t) ? this.createCustomElementClone(t) : t;
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
      (!Va(t) || !RK(t) && !t.hasAttribute(Uy) && (typeof this.options.ignoreElements != "function" || !this.options.ignoreElements(t))) && (!this.options.copyStyles || !Va(t) || !Tm(t)) && e.appendChild(this.cloneNode(t, n));
    }, A.prototype.cloneChildNodes = function(e, t, n) {
      for (var i = this, s = e.shadowRoot ? e.shadowRoot.firstChild : e.firstChild; s; s = s.nextSibling)
        if (Va(s) && Qy(s) && typeof s.assignedNodes == "function") {
          var l = s.assignedNodes();
          l.length && l.forEach(function(f) {
            return i.appendChildNode(t, f, n);
          });
        } else
          this.appendChildNode(t, s, n);
    }, A.prototype.cloneNode = function(e, t) {
      if (my(e))
        return document.createTextNode(e.data);
      if (!e.ownerDocument)
        return e.cloneNode(!1);
      var n = e.ownerDocument.defaultView;
      if (n && Va(e) && (bd(e) || Wl(e))) {
        var i = this.createElementClone(e);
        i.style.transitionProperty = "none";
        var s = n.getComputedStyle(e), l = n.getComputedStyle(e, ":before"), f = n.getComputedStyle(e, ":after");
        this.referenceElement === e && bd(i) && (this.clonedReferenceElement = i), Vp(i) && eR(i);
        var c = this.counters.parse(new wm(this.context, s)), h = this.resolvePseudoContent(e, i, l, vs.BEFORE);
        Dm(e) && (t = !0), Lm(e) || this.cloneChildNodes(e, i, t), h && i.insertBefore(h, i.firstChild);
        var w = this.resolvePseudoContent(e, i, f, vs.AFTER);
        return w && i.appendChild(w), this.counters.pop(c), (s && (this.options.copyStyles || Wl(e)) && !Cy(e) || t) && Hh(s, i), (e.scrollTop !== 0 || e.scrollLeft !== 0) && this.scrolledElements.push([i, e.scrollLeft, e.scrollTop]), (pc(e) || gc(e)) && (pc(i) || gc(i)) && (i.value = e.value), i;
      }
      return e.cloneNode(!1);
    }, A.prototype.resolvePseudoContent = function(e, t, n, i) {
      var s = this;
      if (n) {
        var l = n.content, f = t.ownerDocument;
        if (!(!f || !l || l === "none" || l === "-moz-alt-content" || n.display === "none")) {
          this.counters.parse(new wm(this.context, n));
          var c = new NP(this.context, n), h = f.createElement("html2canvaspseudoelement");
          Hh(n, h), c.content.forEach(function(B) {
            if (B.type === 0)
              h.appendChild(f.createTextNode(B.value));
            else if (B.type === 22) {
              var p = f.createElement("img");
              p.src = B.value, p.style.opacity = "1", h.appendChild(p);
            } else if (B.type === 18) {
              if (B.name === "attr") {
                var v = B.values.filter(Re);
                v.length && h.appendChild(f.createTextNode(e.getAttribute(v[0].value) || ""));
              } else if (B.name === "counter") {
                var o = B.values.filter(ao), C = o[0], F = o[1];
                if (C && Re(C)) {
                  var U = s.counters.getCounterValue(C.value), H = F && Re(F) ? Cd.parse(s.context, F.value) : 3;
                  h.appendChild(f.createTextNode(Ss(U, H, !1)));
                }
              } else if (B.name === "counters") {
                var D = B.values.filter(ao), C = D[0], E = D[1], F = D[2];
                if (C && Re(C)) {
                  var M = s.counters.getCounterValues(C.value), K = F && Re(F) ? Cd.parse(s.context, F.value) : 3, J = E && E.type === 0 ? E.value : "", hA = M.map(function(QA) {
                    return Ss(QA, K, !1);
                  }).join(J);
                  h.appendChild(f.createTextNode(hA));
                }
              }
            } else if (B.type === 20)
              switch (B.value) {
                case "open-quote":
                  h.appendChild(f.createTextNode(Bm(c.quotes, s.quoteDepth++, !0)));
                  break;
                case "close-quote":
                  h.appendChild(f.createTextNode(Bm(c.quotes, --s.quoteDepth, !1)));
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
var VK = function(A, e) {
  var t = A.createElement("iframe");
  return t.className = "html2canvas-container", t.style.visibility = "hidden", t.style.position = "fixed", t.style.left = "-10000px", t.style.top = "0px", t.style.border = "0", t.width = e.width.toString(), t.height = e.height.toString(), t.scrolling = "no", t.setAttribute(Uy, "true"), A.body.appendChild(t), t;
}, WK = function(A) {
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
}, XK = function(A) {
  return Promise.all([].slice.call(A.images, 0).map(WK));
}, qK = function(A) {
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
}, zK = [
  "all",
  "d",
  "content"
  // Safari shows pseudoelements if content is set
], Hh = function(A, e) {
  for (var t = A.length - 1; t >= 0; t--) {
    var n = A.item(t);
    zK.indexOf(n) === -1 && e.style.setProperty(n, A.getPropertyValue(n));
  }
  return e;
}, JK = function(A) {
  var e = "";
  return A && (e += "<!DOCTYPE ", A.name && (e += A.name), A.internalSubset && (e += A.internalSubset), A.publicId && (e += '"' + A.publicId + '"'), A.systemId && (e += '"' + A.systemId + '"'), e += ">"), e;
}, jK = function(A, e, t) {
  A && A.defaultView && (e !== A.defaultView.pageXOffset || t !== A.defaultView.pageYOffset) && A.defaultView.scrollTo(e, t);
}, YK = function(A) {
  var e = A[0], t = A[1], n = A[2];
  e.scrollLeft = t, e.scrollTop = n;
}, ZK = ":before", AR = ":after", _d = "___html2canvas___pseudoelement_before", xd = "___html2canvas___pseudoelement_after", km = `{
    content: "" !important;
    display: none !important;
}`, eR = function(A) {
  tR(A, "." + _d + ZK + km + `
         .` + xd + AR + km);
}, tR = function(A, e) {
  var t = A.ownerDocument;
  if (t) {
    var n = t.createElement("style");
    n.textContent = e, A.appendChild(n);
  }
}, by = (
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
), nR = (
  /** @class */
  function() {
    function A(e, t) {
      this.context = e, this._options = t, this._cache = {};
    }
    return A.prototype.addImage = function(e) {
      var t = Promise.resolve();
      return this.has(e) || (Lh(e) || oR(e)) && (this._cache[e] = this.loadImage(e)).catch(function() {
      }), t;
    }, A.prototype.match = function(e) {
      return this._cache[e];
    }, A.prototype.loadImage = function(e) {
      return kt(this, void 0, void 0, function() {
        var t, n, i, s, l = this;
        return Lt(this, function(f) {
          switch (f.label) {
            case 0:
              return t = by.isSameOrigin(e), n = !Sh(e) && this._options.useCORS === !0 && yt.SUPPORT_CORS_IMAGES && !t, i = !Sh(e) && !t && !Lh(e) && typeof this._options.proxy == "string" && yt.SUPPORT_CORS_XHR && !n, !t && this._options.allowTaint === !1 && !Sh(e) && !Lh(e) && !i && !n ? [
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
                }, w.onerror = h, (sR(s) || n) && (w.crossOrigin = "anonymous"), w.src = s, w.complete === !0 && setTimeout(function() {
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
        var f = yt.SUPPORT_RESPONSE_TYPE ? "blob" : "text", c = new XMLHttpRequest();
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
), rR = /^data:image\/svg\+xml/i, iR = /^data:image\/.*;base64,/i, aR = /^data:image\/.*/i, oR = function(A) {
  return yt.SUPPORT_SVG_DRAWING || !uR(A);
}, Sh = function(A) {
  return aR.test(A);
}, sR = function(A) {
  return iR.test(A);
}, Lh = function(A) {
  return A.substr(0, 4) === "blob";
}, uR = function(A) {
  return A.substr(-3).toLowerCase() === "svg" || rR.test(A);
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
), Ma = function(A, e, t) {
  return new NA(A.x + (e.x - A.x) * t, A.y + (e.y - A.y) * t);
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
), mn = function(A) {
  return A.type === 1;
}, lR = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e) {
      var t = e.styles, n = e.bounds, i = as(t.borderTopLeftRadius, n.width, n.height), s = i[0], l = i[1], f = as(t.borderTopRightRadius, n.width, n.height), c = f[0], h = f[1], w = as(t.borderBottomRightRadius, n.width, n.height), B = w[0], p = w[1], v = as(t.borderBottomLeftRadius, n.width, n.height), o = v[0], C = v[1], F = [];
      F.push((s + c) / n.width), F.push((o + B) / n.width), F.push((l + C) / n.height), F.push((h + p) / n.height);
      var U = Math.max.apply(Math, F);
      U > 1 && (s /= U, l /= U, c /= U, h /= U, B /= U, p /= U, o /= U, C /= U);
      var H = n.width - c, D = n.height - p, E = n.width - B, M = n.height - C, K = t.borderTopWidth, J = t.borderRightWidth, hA = t.borderBottomWidth, cA = t.borderLeftWidth, wA = Ve(t.paddingTop, e.bounds.width), QA = Ve(t.paddingRight, e.bounds.width), OA = Ve(t.paddingBottom, e.bounds.width), EA = Ve(t.paddingLeft, e.bounds.width);
      this.topLeftBorderDoubleOuterBox = s > 0 || l > 0 ? ze(n.left + cA / 3, n.top + K / 3, s - cA / 3, l - K / 3, Ne.TOP_LEFT) : new NA(n.left + cA / 3, n.top + K / 3), this.topRightBorderDoubleOuterBox = s > 0 || l > 0 ? ze(n.left + H, n.top + K / 3, c - J / 3, h - K / 3, Ne.TOP_RIGHT) : new NA(n.left + n.width - J / 3, n.top + K / 3), this.bottomRightBorderDoubleOuterBox = B > 0 || p > 0 ? ze(n.left + E, n.top + D, B - J / 3, p - hA / 3, Ne.BOTTOM_RIGHT) : new NA(n.left + n.width - J / 3, n.top + n.height - hA / 3), this.bottomLeftBorderDoubleOuterBox = o > 0 || C > 0 ? ze(n.left + cA / 3, n.top + M, o - cA / 3, C - hA / 3, Ne.BOTTOM_LEFT) : new NA(n.left + cA / 3, n.top + n.height - hA / 3), this.topLeftBorderDoubleInnerBox = s > 0 || l > 0 ? ze(n.left + cA * 2 / 3, n.top + K * 2 / 3, s - cA * 2 / 3, l - K * 2 / 3, Ne.TOP_LEFT) : new NA(n.left + cA * 2 / 3, n.top + K * 2 / 3), this.topRightBorderDoubleInnerBox = s > 0 || l > 0 ? ze(n.left + H, n.top + K * 2 / 3, c - J * 2 / 3, h - K * 2 / 3, Ne.TOP_RIGHT) : new NA(n.left + n.width - J * 2 / 3, n.top + K * 2 / 3), this.bottomRightBorderDoubleInnerBox = B > 0 || p > 0 ? ze(n.left + E, n.top + D, B - J * 2 / 3, p - hA * 2 / 3, Ne.BOTTOM_RIGHT) : new NA(n.left + n.width - J * 2 / 3, n.top + n.height - hA * 2 / 3), this.bottomLeftBorderDoubleInnerBox = o > 0 || C > 0 ? ze(n.left + cA * 2 / 3, n.top + M, o - cA * 2 / 3, C - hA * 2 / 3, Ne.BOTTOM_LEFT) : new NA(n.left + cA * 2 / 3, n.top + n.height - hA * 2 / 3), this.topLeftBorderStroke = s > 0 || l > 0 ? ze(n.left + cA / 2, n.top + K / 2, s - cA / 2, l - K / 2, Ne.TOP_LEFT) : new NA(n.left + cA / 2, n.top + K / 2), this.topRightBorderStroke = s > 0 || l > 0 ? ze(n.left + H, n.top + K / 2, c - J / 2, h - K / 2, Ne.TOP_RIGHT) : new NA(n.left + n.width - J / 2, n.top + K / 2), this.bottomRightBorderStroke = B > 0 || p > 0 ? ze(n.left + E, n.top + D, B - J / 2, p - hA / 2, Ne.BOTTOM_RIGHT) : new NA(n.left + n.width - J / 2, n.top + n.height - hA / 2), this.bottomLeftBorderStroke = o > 0 || C > 0 ? ze(n.left + cA / 2, n.top + M, o - cA / 2, C - hA / 2, Ne.BOTTOM_LEFT) : new NA(n.left + cA / 2, n.top + n.height - hA / 2), this.topLeftBorderBox = s > 0 || l > 0 ? ze(n.left, n.top, s, l, Ne.TOP_LEFT) : new NA(n.left, n.top), this.topRightBorderBox = c > 0 || h > 0 ? ze(n.left + H, n.top, c, h, Ne.TOP_RIGHT) : new NA(n.left + n.width, n.top), this.bottomRightBorderBox = B > 0 || p > 0 ? ze(n.left + E, n.top + D, B, p, Ne.BOTTOM_RIGHT) : new NA(n.left + n.width, n.top + n.height), this.bottomLeftBorderBox = o > 0 || C > 0 ? ze(n.left, n.top + M, o, C, Ne.BOTTOM_LEFT) : new NA(n.left, n.top + n.height), this.topLeftPaddingBox = s > 0 || l > 0 ? ze(n.left + cA, n.top + K, Math.max(0, s - cA), Math.max(0, l - K), Ne.TOP_LEFT) : new NA(n.left + cA, n.top + K), this.topRightPaddingBox = c > 0 || h > 0 ? ze(n.left + Math.min(H, n.width - J), n.top + K, H > n.width + J ? 0 : Math.max(0, c - J), Math.max(0, h - K), Ne.TOP_RIGHT) : new NA(n.left + n.width - J, n.top + K), this.bottomRightPaddingBox = B > 0 || p > 0 ? ze(n.left + Math.min(E, n.width - cA), n.top + Math.min(D, n.height - hA), Math.max(0, B - J), Math.max(0, p - hA), Ne.BOTTOM_RIGHT) : new NA(n.left + n.width - J, n.top + n.height - hA), this.bottomLeftPaddingBox = o > 0 || C > 0 ? ze(n.left + cA, n.top + Math.min(M, n.height - hA), Math.max(0, o - cA), Math.max(0, C - hA), Ne.BOTTOM_LEFT) : new NA(n.left + cA, n.top + n.height - hA), this.topLeftContentBox = s > 0 || l > 0 ? ze(n.left + cA + EA, n.top + K + wA, Math.max(0, s - (cA + EA)), Math.max(0, l - (K + wA)), Ne.TOP_LEFT) : new NA(n.left + cA + EA, n.top + K + wA), this.topRightContentBox = c > 0 || h > 0 ? ze(n.left + Math.min(H, n.width + cA + EA), n.top + K + wA, H > n.width + cA + EA ? 0 : c - cA + EA, h - (K + wA), Ne.TOP_RIGHT) : new NA(n.left + n.width - (J + QA), n.top + K + wA), this.bottomRightContentBox = B > 0 || p > 0 ? ze(n.left + Math.min(E, n.width - (cA + EA)), n.top + Math.min(D, n.height + K + wA), Math.max(0, B - (J + QA)), p - (hA + OA), Ne.BOTTOM_RIGHT) : new NA(n.left + n.width - (J + QA), n.top + n.height - (hA + OA)), this.bottomLeftContentBox = o > 0 || C > 0 ? ze(n.left + cA + EA, n.top + M, Math.max(0, o - (cA + EA)), C - (hA + OA), Ne.BOTTOM_LEFT) : new NA(n.left + cA + EA, n.top + n.height - (hA + OA));
    }
    return A;
  }()
), Ne;
(function(A) {
  A[A.TOP_LEFT = 0] = "TOP_LEFT", A[A.TOP_RIGHT = 1] = "TOP_RIGHT", A[A.BOTTOM_RIGHT = 2] = "BOTTOM_RIGHT", A[A.BOTTOM_LEFT = 3] = "BOTTOM_LEFT";
})(Ne || (Ne = {}));
var ze = function(A, e, t, n, i) {
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
}, cR = function(A) {
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
}, fR = (
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
), hR = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e) {
      this.opacity = e, this.type = 2, this.target = 6;
    }
    return A;
  }()
), dR = function(A) {
  return A.type === 0;
}, Ey = function(A) {
  return A.type === 1;
}, pR = function(A) {
  return A.type === 2;
}, $m = function(A, e) {
  return A.length === e.length ? A.some(function(t, n) {
    return t === e[n];
  }) : !1;
}, gR = function(A, e, t, n, i) {
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
}, _y = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e) {
      this.element = e, this.inlineLevel = [], this.nonInlineLevel = [], this.negativeZIndex = [], this.zeroOrAutoZIndexOrTransformedOrOpacity = [], this.positiveZIndex = [], this.nonPositionedFloats = [], this.nonPositionedInlineLevel = [];
    }
    return A;
  }()
), xy = (
  /** @class */
  function() {
    function A(e, t) {
      if (this.container = e, this.parent = t, this.effects = [], this.curves = new lR(this.container), this.container.styles.opacity < 1 && this.effects.push(new hR(this.container.styles.opacity)), this.container.styles.transform !== null) {
        var n = this.container.bounds.left + this.container.styles.transformOrigin[0].number, i = this.container.bounds.top + this.container.styles.transformOrigin[1].number, s = this.container.styles.transform;
        this.effects.push(new fR(n, i, s));
      }
      if (this.container.styles.overflowX !== 0) {
        var l = Bc(this.curves), f = wc(this.curves);
        $m(l, f) ? this.effects.push(new xl(
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
          return !Ey(c);
        });
        if (t || n.container.styles.position !== 0 || !n.parent) {
          if (i.unshift.apply(i, s), t = [
            2,
            3
            /* FIXED */
          ].indexOf(n.container.styles.position) === -1, n.container.styles.overflowX !== 0) {
            var l = Bc(n.curves), f = wc(n.curves);
            $m(l, f) || i.unshift(new xl(
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
        return ct(c.target, e);
      });
    }, A;
  }()
), Id = function(A, e, t, n) {
  A.container.elements.forEach(function(i) {
    var s = ct(
      i.flags,
      4
      /* CREATES_REAL_STACKING_CONTEXT */
    ), l = ct(
      i.flags,
      2
      /* CREATES_STACKING_CONTEXT */
    ), f = new xy(i, A);
    ct(
      i.styles.display,
      2048
      /* LIST_ITEM */
    ) && n.push(f);
    var c = ct(
      i.flags,
      8
      /* IS_LIST_OWNER */
    ) ? [] : n;
    if (s || l) {
      var h = s || i.styles.isPositioned() ? t : e, w = new _y(f);
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
    ct(
      i.flags,
      8
      /* IS_LIST_OWNER */
    ) && Iy(i, c);
  });
}, Iy = function(A, e) {
  for (var t = A instanceof Ud ? A.start : 1, n = A instanceof Ud ? A.reversed : !1, i = 0; i < e.length; i++) {
    var s = e[i];
    s.container instanceof hy && typeof s.container.value == "number" && s.container.value !== 0 && (t = s.container.value), s.listValue = Ss(t, s.container.styles.listStyleType, !0), t += n ? -1 : 1;
  }
}, BR = function(A) {
  var e = new xy(A, null), t = new _y(e), n = [];
  return Id(e, t, t, n), Iy(e.container, n), t;
}, Gm = function(A, e) {
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
}, wR = function(A, e) {
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
}, mR = function(A, e) {
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
}, vR = function(A, e) {
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
}, Hy = function(A) {
  var e = A.bounds, t = A.styles;
  return e.add(t.borderLeftWidth, t.borderTopWidth, -(t.borderRightWidth + t.borderLeftWidth), -(t.borderTopWidth + t.borderBottomWidth));
}, mc = function(A) {
  var e = A.styles, t = A.bounds, n = Ve(e.paddingLeft, t.width), i = Ve(e.paddingRight, t.width), s = Ve(e.paddingTop, t.width), l = Ve(e.paddingBottom, t.width);
  return t.add(n + e.borderLeftWidth, s + e.borderTopWidth, -(e.borderRightWidth + e.borderLeftWidth + n + i), -(e.borderTopWidth + e.borderBottomWidth + s + l));
}, yR = function(A, e) {
  return A === 0 ? e.bounds : A === 2 ? mc(e) : Hy(e);
}, CR = function(A, e) {
  return A === 0 ? e.bounds : A === 2 ? mc(e) : Hy(e);
}, Th = function(A, e, t) {
  var n = yR($a(A.styles.backgroundOrigin, e), A), i = CR($a(A.styles.backgroundClip, e), A), s = QR($a(A.styles.backgroundSize, e), t, n), l = s[0], f = s[1], c = as($a(A.styles.backgroundPosition, e), n.width - l, n.height - f), h = FR($a(A.styles.backgroundRepeat, e), c, s, n, i), w = Math.round(n.left + c[0]), B = Math.round(n.top + c[1]);
  return [h, w, B, l, f];
}, Pa = function(A) {
  return Re(A) && A.value === Ja.AUTO;
}, Hl = function(A) {
  return typeof A == "number";
}, QR = function(A, e, t) {
  var n = e[0], i = e[1], s = e[2], l = A[0], f = A[1];
  if (!l)
    return [0, 0];
  if (ot(l) && f && ot(f))
    return [Ve(l, t.width), Ve(f, t.height)];
  var c = Hl(s);
  if (Re(l) && (l.value === Ja.CONTAIN || l.value === Ja.COVER)) {
    if (Hl(s)) {
      var h = t.width / t.height;
      return h < s != (l.value === Ja.COVER) ? [t.width, t.width / s] : [t.height * s, t.height];
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
    var U = 0, H = 0;
    return ot(l) ? U = Ve(l, t.width) : ot(f) && (H = Ve(f, t.height)), Pa(l) ? U = H * s : (!f || Pa(f)) && (H = U / s), [U, H];
  }
  var D = null, E = null;
  if (ot(l) ? D = Ve(l, t.width) : f && ot(f) && (E = Ve(f, t.height)), D !== null && (!f || Pa(f)) && (E = w && B ? D / n * i : t.height), E !== null && Pa(l) && (D = w && B ? E / i * n : t.width), D !== null && E !== null)
    return [D, E];
  throw new Error("Unable to calculate background-size for element");
}, $a = function(A, e) {
  var t = A[e];
  return typeof t > "u" ? A[0] : t;
}, FR = function(A, e, t, n, i) {
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
}, UR = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", Vm = "Hidden Text", bR = (
  /** @class */
  function() {
    function A(e) {
      this._data = {}, this._document = e;
    }
    return A.prototype.parseMetrics = function(e, t) {
      var n = this._document.createElement("div"), i = this._document.createElement("img"), s = this._document.createElement("span"), l = this._document.body;
      n.style.visibility = "hidden", n.style.fontFamily = e, n.style.fontSize = t, n.style.margin = "0", n.style.padding = "0", n.style.whiteSpace = "nowrap", l.appendChild(n), i.src = UR, i.width = 1, i.height = 1, i.style.margin = "0", i.style.padding = "0", i.style.verticalAlign = "baseline", s.style.fontFamily = e, s.style.fontSize = t, s.style.margin = "0", s.style.padding = "0", s.appendChild(this._document.createTextNode(Vm)), n.appendChild(s), n.appendChild(i);
      var f = i.offsetTop - s.offsetTop + 2;
      n.removeChild(s), n.appendChild(this._document.createTextNode(Vm)), n.style.lineHeight = "normal", i.style.verticalAlign = "super";
      var c = i.offsetTop - n.offsetTop + 2;
      return l.removeChild(n), { baseline: f, middle: c };
    }, A.prototype.getMetrics = function(e, t) {
      var n = e + " " + t;
      return typeof this._data[n] > "u" && (this._data[n] = this.parseMetrics(e, t)), this._data[n];
    }, A;
  }()
), Sy = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t) {
      this.context = e, this.options = t;
    }
    return A;
  }()
), ER = 1e4, _R = (
  /** @class */
  function(A) {
    Xn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i._activeEffects = [], i.canvas = n.canvas ? n.canvas : document.createElement("canvas"), i.ctx = i.canvas.getContext("2d"), n.canvas || (i.canvas.width = Math.floor(n.width * n.scale), i.canvas.height = Math.floor(n.height * n.scale), i.canvas.style.width = n.width + "px", i.canvas.style.height = n.height + "px"), i.fontMetrics = new bR(document), i.ctx.scale(i.options.scale, i.options.scale), i.ctx.translate(-n.x, -n.y), i.ctx.textBaseline = "bottom", i._activeEffects = [], i.context.logger.debug("Canvas renderer initialized (" + n.width + "x" + n.height + ") with scale " + n.scale), i;
    }
    return e.prototype.applyEffects = function(t) {
      for (var n = this; this._activeEffects.length; )
        this.popEffect();
      t.forEach(function(i) {
        return n.applyEffect(i);
      });
    }, e.prototype.applyEffect = function(t) {
      this.ctx.save(), pR(t) && (this.ctx.globalAlpha = t.opacity), dR(t) && (this.ctx.translate(t.offsetX, t.offsetY), this.ctx.transform(t.matrix[0], t.matrix[1], t.matrix[2], t.matrix[3], t.matrix[4], t.matrix[5]), this.ctx.translate(-t.offsetX, -t.offsetY)), Ey(t) && (this.path(t.path), this.ctx.clip()), this._activeEffects.push(t);
    }, e.prototype.popEffect = function() {
      this._activeEffects.pop(), this.ctx.restore();
    }, e.prototype.renderStack = function(t) {
      return kt(this, void 0, void 0, function() {
        var n;
        return Lt(this, function(i) {
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
        return Lt(this, function(n) {
          switch (n.label) {
            case 0:
              if (ct(
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
        var l = $p(t.text);
        l.reduce(function(f, c) {
          return s.ctx.fillText(c, f, t.bounds.top + i), f + s.ctx.measureText(c).width;
        }, t.bounds.left);
      }
    }, e.prototype.createFontStyle = function(t) {
      var n = t.fontVariant.filter(function(l) {
        return l === "normal" || l === "small-caps";
      }).join(""), i = LR(t.fontFamily).join(", "), s = ks(t.fontSize) ? "" + t.fontSize.number + t.fontSize.unit : t.fontSize.number + "px";
      return [
        [t.fontStyle, n, t.fontWeight, s, i].join(" "),
        i,
        s
      ];
    }, e.prototype.renderTextNode = function(t, n) {
      return kt(this, void 0, void 0, function() {
        var i, s, l, f, c, h, w, B, p = this;
        return Lt(this, function(v) {
          return i = this.createFontStyle(n), s = i[0], l = i[1], f = i[2], this.ctx.font = s, this.ctx.direction = n.direction === 1 ? "rtl" : "ltr", this.ctx.textAlign = "left", this.ctx.textBaseline = "alphabetic", c = this.fontMetrics.getMetrics(l, f), h = c.baseline, w = c.middle, B = n.paintOrder, t.textBounds.forEach(function(o) {
            B.forEach(function(C) {
              switch (C) {
                case 0:
                  p.ctx.fillStyle = pt(n.color), p.renderTextWithLetterSpacing(o, n.letterSpacing, h);
                  var F = n.textShadow;
                  F.length && o.text.trim().length && (F.slice(0).reverse().forEach(function(U) {
                    p.ctx.shadowColor = pt(U.color), p.ctx.shadowOffsetX = U.offsetX.number * p.options.scale, p.ctx.shadowOffsetY = U.offsetY.number * p.options.scale, p.ctx.shadowBlur = U.blur.number, p.renderTextWithLetterSpacing(o, n.letterSpacing, h);
                  }), p.ctx.shadowColor = "", p.ctx.shadowOffsetX = 0, p.ctx.shadowOffsetY = 0, p.ctx.shadowBlur = 0), n.textDecorationLine.length && (p.ctx.fillStyle = pt(n.textDecorationColor || n.color), n.textDecorationLine.forEach(function(U) {
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
                  n.webkitTextStrokeWidth && o.text.trim().length && (p.ctx.strokeStyle = pt(n.webkitTextStrokeColor), p.ctx.lineWidth = n.webkitTextStrokeWidth, p.ctx.lineJoin = window.chrome ? "miter" : "round", p.ctx.strokeText(o.text, o.bounds.left, o.bounds.top + h)), p.ctx.strokeStyle = "", p.ctx.lineWidth = 0, p.ctx.lineJoin = "miter";
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
        var n, i, s, l, f, c, H, H, h, w, B, p, E, v, o, M, C, F, U, H, D, E, M;
        return Lt(this, function(K) {
          switch (K.label) {
            case 0:
              this.applyEffects(t.getEffects(
                4
                /* CONTENT */
              )), n = t.container, i = t.curves, s = n.styles, l = 0, f = n.textNodes, K.label = 1;
            case 1:
              return l < f.length ? (c = f[l], [4, this.renderTextNode(c, s)]) : [3, 4];
            case 2:
              K.sent(), K.label = 3;
            case 3:
              return l++, [3, 1];
            case 4:
              if (!(n instanceof ly)) return [3, 8];
              K.label = 5;
            case 5:
              return K.trys.push([5, 7, , 8]), [4, this.context.cache.match(n.src)];
            case 6:
              return H = K.sent(), this.renderReplacedElement(n, i, H), [3, 8];
            case 7:
              return K.sent(), this.context.logger.error("Error loading image " + n.src), [3, 8];
            case 8:
              if (n instanceof cy && this.renderReplacedElement(n, i, n.canvas), !(n instanceof fy)) return [3, 12];
              K.label = 9;
            case 9:
              return K.trys.push([9, 11, , 12]), [4, this.context.cache.match(n.svg)];
            case 10:
              return H = K.sent(), this.renderReplacedElement(n, i, H), [3, 12];
            case 11:
              return K.sent(), this.context.logger.error("Error loading svg " + n.svg.substring(0, 255)), [3, 12];
            case 12:
              return n instanceof gy && n.tree ? (h = new e(this.context, {
                scale: this.options.scale,
                backgroundColor: n.backgroundColor,
                x: 0,
                y: 0,
                width: n.width,
                height: n.height
              }), [4, h.render(n.tree)]) : [3, 14];
            case 13:
              w = K.sent(), n.width && n.height && this.ctx.drawImage(w, 0, 0, n.width, n.height, n.bounds.left, n.bounds.top, n.bounds.width, n.bounds.height), K.label = 14;
            case 14:
              if (n instanceof Gp && (B = Math.min(n.bounds.width, n.bounds.height), n.type === hc ? n.checked && (this.ctx.save(), this.path([
                new NA(n.bounds.left + B * 0.39363, n.bounds.top + B * 0.79),
                new NA(n.bounds.left + B * 0.16, n.bounds.top + B * 0.5549),
                new NA(n.bounds.left + B * 0.27347, n.bounds.top + B * 0.44071),
                new NA(n.bounds.left + B * 0.39694, n.bounds.top + B * 0.5649),
                new NA(n.bounds.left + B * 0.72983, n.bounds.top + B * 0.23),
                new NA(n.bounds.left + B * 0.84, n.bounds.top + B * 0.34085),
                new NA(n.bounds.left + B * 0.39363, n.bounds.top + B * 0.79)
              ]), this.ctx.fillStyle = pt(Sm), this.ctx.fill(), this.ctx.restore()) : n.type === dc && n.checked && (this.ctx.save(), this.ctx.beginPath(), this.ctx.arc(n.bounds.left + B / 2, n.bounds.top + B / 2, B / 4, 0, Math.PI * 2, !0), this.ctx.fillStyle = pt(Sm), this.ctx.fill(), this.ctx.restore())), xR(n) && n.value.length) {
                switch (p = this.createFontStyle(s), E = p[0], v = p[1], o = this.fontMetrics.getMetrics(E, v).baseline, this.ctx.font = E, this.ctx.fillStyle = pt(s.color), this.ctx.textBaseline = "alphabetic", this.ctx.textAlign = HR(n.styles.textAlign), M = mc(n), C = 0, n.styles.textAlign) {
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
              if (!ct(
                n.styles.display,
                2048
                /* LIST_ITEM */
              )) return [3, 20];
              if (n.styles.listStyleImage === null) return [3, 19];
              if (U = n.styles.listStyleImage, U.type !== 0) return [3, 18];
              H = void 0, D = U.url, K.label = 15;
            case 15:
              return K.trys.push([15, 17, , 18]), [4, this.context.cache.match(D)];
            case 16:
              return H = K.sent(), this.ctx.drawImage(H, n.bounds.left - (H.width + 10), n.bounds.top), [3, 18];
            case 17:
              return K.sent(), this.context.logger.error("Error loading list-style-image " + D), [3, 18];
            case 18:
              return [3, 20];
            case 19:
              t.listValue && n.styles.listStyleType !== -1 && (E = this.createFontStyle(s)[0], this.ctx.font = E, this.ctx.fillStyle = pt(s.color), this.ctx.textBaseline = "middle", this.ctx.textAlign = "right", M = new $r(n.bounds.left, n.bounds.top + Ve(n.styles.paddingTop, n.bounds.width), n.bounds.width, pm(s.lineHeight, s.fontSize.number) / 2 + 1), this.renderTextWithLetterSpacing(new ms(t.listValue, M), s.letterSpacing, pm(s.lineHeight, s.fontSize.number) / 2 + 2), this.ctx.textBaseline = "bottom", this.ctx.textAlign = "left"), K.label = 20;
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
        return Lt(this, function(H) {
          switch (H.label) {
            case 0:
              if (ct(
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
        return Lt(this, function(h) {
          switch (h.label) {
            case 0:
              n = t.styles.backgroundImage.length - 1, i = function(w) {
                var B, p, v, wA, iA, gA, EA, q, hA, o, wA, iA, gA, EA, q, C, F, U, H, D, E, M, K, J, hA, cA, wA, QA, OA, EA, q, CA, iA, gA, IA, HA, uA, T, rA, j, S, R;
                return Lt(this, function(aA) {
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
                      ]), wA = v[0], iA = v[1], gA = v[2], EA = v[3], q = v[4], hA = s.ctx.createPattern(s.resizeImage(B, EA, q), "repeat"), s.renderRepeat(wA, hA, iA, gA)), [3, 6];
                    case 5:
                      dM(w) ? (o = Th(t, n, [null, null, null]), wA = o[0], iA = o[1], gA = o[2], EA = o[3], q = o[4], C = uM(w.angle, EA, q), F = C[0], U = C[1], H = C[2], D = C[3], E = C[4], M = document.createElement("canvas"), M.width = EA, M.height = q, K = M.getContext("2d"), J = K.createLinearGradient(U, D, H, E), hm(w.stops, F).forEach(function(bA) {
                        return J.addColorStop(bA.stop, pt(bA.color));
                      }), K.fillStyle = J, K.fillRect(0, 0, EA, q), EA > 0 && q > 0 && (hA = s.ctx.createPattern(M, "repeat"), s.renderRepeat(wA, hA, iA, gA))) : pM(w) && (cA = Th(t, n, [
                        null,
                        null,
                        null
                      ]), wA = cA[0], QA = cA[1], OA = cA[2], EA = cA[3], q = cA[4], CA = w.position.length === 0 ? [Kp] : w.position, iA = Ve(CA[0], EA), gA = Ve(CA[CA.length - 1], q), IA = lM(w, iA, gA, EA, q), HA = IA[0], uA = IA[1], HA > 0 && uA > 0 && (T = s.ctx.createRadialGradient(QA + iA, OA + gA, 0, QA + iA, OA + gA, HA), hm(w.stops, HA * 2).forEach(function(bA) {
                        return T.addColorStop(bA.stop, pt(bA.color));
                      }), s.path(wA), s.ctx.fillStyle = T, HA !== uA ? (rA = t.bounds.left + 0.5 * t.bounds.width, j = t.bounds.top + 0.5 * t.bounds.height, S = uA / HA, R = 1 / S, s.ctx.save(), s.ctx.translate(rA, j), s.ctx.transform(1, 0, 0, S, 0, 0), s.ctx.translate(-rA, -j), s.ctx.fillRect(QA, R * (OA - j) + j, EA, q * R), s.ctx.restore()) : s.ctx.fill())), aA.label = 6;
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
        return Lt(this, function(s) {
          return this.path(Gm(i, n)), this.ctx.fillStyle = pt(t), this.ctx.fill(), [
            2
            /*return*/
          ];
        });
      });
    }, e.prototype.renderDoubleBorder = function(t, n, i, s) {
      return kt(this, void 0, void 0, function() {
        var l, f;
        return Lt(this, function(c) {
          switch (c.label) {
            case 0:
              return n < 3 ? [4, this.renderSolidBorder(t, i, s)] : [3, 2];
            case 1:
              return c.sent(), [
                2
                /*return*/
              ];
            case 2:
              return l = wR(s, i), this.path(l), this.ctx.fillStyle = pt(t), this.ctx.fill(), f = mR(s, i), this.path(f), this.ctx.fill(), [
                2
                /*return*/
              ];
          }
        });
      });
    }, e.prototype.renderNodeBackgroundAndBorders = function(t) {
      return kt(this, void 0, void 0, function() {
        var n, i, s, l, f, c, h, w, B = this;
        return Lt(this, function(p) {
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
              ], l = IR($a(n.backgroundClip, 0), t.curves), i || n.boxShadow.length ? (this.ctx.save(), this.path(l), this.ctx.clip(), vi(n.backgroundColor) || (this.ctx.fillStyle = pt(n.backgroundColor), this.ctx.fill()), [4, this.renderBackgroundImage(t.container)]) : [3, 2];
            case 1:
              p.sent(), this.ctx.restore(), n.boxShadow.slice(0).reverse().forEach(function(v) {
                B.ctx.save();
                var o = Bc(t.curves), C = v.inset ? 0 : ER, F = gR(o, -C + (v.inset ? 1 : -1) * v.spread.number, (v.inset ? 1 : -1) * v.spread.number, v.spread.number * (v.inset ? -2 : 2), v.spread.number * (v.inset ? -2 : 2));
                v.inset ? (B.path(o), B.ctx.clip(), B.mask(F)) : (B.mask(o), B.ctx.clip(), B.path(F)), B.ctx.shadowOffsetX = v.offsetX.number + C, B.ctx.shadowOffsetY = v.offsetY.number, B.ctx.shadowColor = pt(v.color), B.ctx.shadowBlur = v.blur.number, B.ctx.fillStyle = v.inset ? pt(v.color) : "rgba(0,0,0,1)", B.ctx.fill(), B.ctx.restore();
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
        var f, c, h, w, B, p, v, o, C, F, U, H, D, E, M, K, M, K;
        return Lt(this, function(J) {
          return this.ctx.save(), f = vR(s, i), c = Gm(s, i), l === 2 && (this.path(c), this.ctx.clip()), mn(c[0]) ? (h = c[0].start.x, w = c[0].start.y) : (h = c[0].x, w = c[0].y), mn(c[1]) ? (B = c[1].end.x, p = c[1].end.y) : (B = c[1].x, p = c[1].y), i === 0 || i === 2 ? v = Math.abs(h - B) : v = Math.abs(w - p), this.ctx.beginPath(), l === 3 ? this.formatPath(f) : this.formatPath(c.slice(0, 2)), o = n < 3 ? n * 3 : n * 2, C = n < 3 ? n * 2 : n, l === 3 && (o = n, C = n), F = !0, v <= o * 2 ? F = !1 : v <= o * 2 + C ? (U = v / (2 * o + C), o *= U, C *= U) : (H = Math.floor((v + C) / (o + C)), D = (v - H * o) / (H - 1), E = (v - (H + 1) * o) / H, C = E <= 0 || Math.abs(C - D) < Math.abs(C - E) ? D : E), F && (l === 3 ? this.ctx.setLineDash([0, o + C]) : this.ctx.setLineDash([o, C])), l === 3 ? (this.ctx.lineCap = "round", this.ctx.lineWidth = n) : this.ctx.lineWidth = n * 2 + 1.1, this.ctx.strokeStyle = pt(t), this.ctx.stroke(), this.ctx.setLineDash([]), l === 2 && (mn(c[0]) && (M = c[3], K = c[0], this.ctx.beginPath(), this.formatPath([new NA(M.end.x, M.end.y), new NA(K.start.x, K.start.y)]), this.ctx.stroke()), mn(c[1]) && (M = c[1], K = c[2], this.ctx.beginPath(), this.formatPath([new NA(M.end.x, M.end.y), new NA(K.start.x, K.start.y)]), this.ctx.stroke())), this.ctx.restore(), [
            2
            /*return*/
          ];
        });
      });
    }, e.prototype.render = function(t) {
      return kt(this, void 0, void 0, function() {
        var n;
        return Lt(this, function(i) {
          switch (i.label) {
            case 0:
              return this.options.backgroundColor && (this.ctx.fillStyle = pt(this.options.backgroundColor), this.ctx.fillRect(this.options.x, this.options.y, this.options.width, this.options.height)), n = BR(t), [4, this.renderStack(n)];
            case 1:
              return i.sent(), this.applyEffects([]), [2, this.canvas];
          }
        });
      });
    }, e;
  }(Sy)
), xR = function(A) {
  return A instanceof py || A instanceof dy ? !0 : A instanceof Gp && A.type !== dc && A.type !== hc;
}, IR = function(A, e) {
  switch (A) {
    case 0:
      return Bc(e);
    case 2:
      return cR(e);
    case 1:
    default:
      return wc(e);
  }
}, HR = function(A) {
  switch (A) {
    case 1:
      return "center";
    case 2:
      return "right";
    case 0:
    default:
      return "left";
  }
}, SR = ["-apple-system", "system-ui"], LR = function(A) {
  return /iPhone OS 15_(0|1)/.test(window.navigator.userAgent) ? A.filter(function(e) {
    return SR.indexOf(e) === -1;
  }) : A;
}, TR = (
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
        return Lt(this, function(s) {
          switch (s.label) {
            case 0:
              return n = Fd(this.options.width * this.options.scale, this.options.height * this.options.scale, this.options.scale, this.options.scale, t), [4, DR(n)];
            case 1:
              return i = s.sent(), this.options.backgroundColor && (this.ctx.fillStyle = pt(this.options.backgroundColor), this.ctx.fillRect(0, 0, this.options.width * this.options.scale, this.options.height * this.options.scale)), this.ctx.drawImage(i, -this.options.x * this.options.scale, -this.options.y * this.options.scale), [2, this.canvas];
          }
        });
      });
    }, e;
  }(Sy)
), DR = function(A) {
  return new Promise(function(e, t) {
    var n = new Image();
    n.onload = function() {
      e(n);
    }, n.onerror = t, n.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(A));
  });
}, OR = (
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
), NR = (
  /** @class */
  function() {
    function A(e, t) {
      var n;
      this.windowBounds = t, this.instanceName = "#" + A.instanceCount++, this.logger = new OR({ id: this.instanceName, enabled: e.logging }), this.cache = (n = e.cache) !== null && n !== void 0 ? n : new nR(this, e);
    }
    return A.instanceCount = 1, A;
  }()
), MR = function(A, e) {
  return e === void 0 && (e = {}), PR(A, e);
};
typeof window < "u" && by.setContext(window);
var PR = function(A, e) {
  return kt(void 0, void 0, void 0, function() {
    var t, n, i, s, l, f, c, h, w, B, p, v, o, C, F, U, H, D, E, M, J, K, J, hA, cA, wA, QA, OA, EA, q, CA, iA, gA, IA, HA, uA, T, rA, j, S;
    return Lt(this, function(R) {
      switch (R.label) {
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
            windowHeight: (EA = e.windowHeight) !== null && EA !== void 0 ? EA : n.innerHeight,
            scrollX: (q = e.scrollX) !== null && q !== void 0 ? q : n.pageXOffset,
            scrollY: (CA = e.scrollY) !== null && CA !== void 0 ? CA : n.pageYOffset
          }, f = new $r(l.scrollX, l.scrollY, l.windowWidth, l.windowHeight), c = new NR(s, f), h = (iA = e.foreignObjectRendering) !== null && iA !== void 0 ? iA : !1, w = {
            allowTaint: (gA = e.allowTaint) !== null && gA !== void 0 ? gA : !1,
            onclone: e.onclone,
            ignoreElements: e.ignoreElements,
            inlineImages: h,
            copyStyles: h
          }, c.logger.debug("Starting document clone with size " + f.width + "x" + f.height + " scrolled to " + -f.left + "," + -f.top), B = new Rm(c, A, w), p = B.clonedReferenceElement, p ? [4, B.toIFrame(t, f)] : [2, Promise.reject("Unable to find element in cloned iframe")];
        case 1:
          return v = R.sent(), o = Vp(p) || KK(p) ? g4(p.ownerDocument) : Sc(c, p), C = o.width, F = o.height, U = o.left, H = o.top, D = KR(c, p, e.backgroundColor), E = {
            canvas: e.canvas,
            backgroundColor: D,
            scale: (HA = (IA = e.scale) !== null && IA !== void 0 ? IA : n.devicePixelRatio) !== null && HA !== void 0 ? HA : 1,
            x: ((uA = e.x) !== null && uA !== void 0 ? uA : 0) + U,
            y: ((T = e.y) !== null && T !== void 0 ? T : 0) + H,
            width: (rA = e.width) !== null && rA !== void 0 ? rA : Math.ceil(C),
            height: (j = e.height) !== null && j !== void 0 ? j : Math.ceil(F)
          }, h ? (c.logger.debug("Document cloned, using foreign object rendering"), J = new TR(c, E), [4, J.render(p)]) : [3, 3];
        case 2:
          return M = R.sent(), [3, 5];
        case 3:
          return c.logger.debug("Document cloned, element located at " + U + "," + H + " with size " + C + "x" + F + " using computed rendering"), c.logger.debug("Starting DOM parsing"), K = wy(c, p), D === K.styles.backgroundColor && (K.styles.backgroundColor = Pr.TRANSPARENT), c.logger.debug("Starting renderer for element at " + E.x + "," + E.y + " with size " + E.width + "x" + E.height), J = new _R(c, E), [4, J.render(K)];
        case 4:
          M = R.sent(), R.label = 5;
        case 5:
          return (!((S = e.removeContainer) !== null && S !== void 0) || S) && (Rm.destroy(v) || c.logger.error("Cannot detach cloned iframe as it is not in the DOM anymore")), c.logger.debug("Finished rendering"), [2, M];
      }
    });
  });
}, KR = function(A, e, t) {
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
    return _e.pull(t, i), n;
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
  }, t = _e.merge({}, e, A), n, i, s, l, f, c, h, w, B, p, v, o, C, F, U, H, D = !1, E = {}, M = function() {
    if (D) {
      var k = ae(n).height();
      t.height = k - 80, t.width = "100%";
    }
  }, K = function() {
    D ? (t.height = E.height, t.width = E.width, WA(n).classed("fullscreen", !1), D = !1) : (E.height = t.height, E.width = t.width, WA(n).classed("fullscreen", !0), D = !0), M(), CA(), cA(), X();
  }, J = function() {
    var k = { width: t.width, height: t.height };
    if (k.width.toString().indexOf("%") >= 0 || k.height.toString().indexOf("%") >= 0) {
      var eA = WA(n).select("svg").node().getBoundingClientRect();
      k.width.toString().indexOf("%") >= 0 && (k.width = eA.width), k.height.toString().indexOf("%") >= 0 && (k.height = eA.height);
    }
    return k;
  }, hA = function() {
    const k = Gi(i.node()), eA = k.k, lA = [k.x, k.y];
    return lA[0] !== 0 || lA[1] !== 0 || eA !== 1;
  }, cA = function() {
    const k = Gi(i.node()), eA = k.k, lA = [k.x, k.y];
    eA === 1 && _e.isEqual(lA, [0, 0]) || (c.translate([0, 0]), c.scale(1), s.attr(
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
  }, EA = async function() {
    const k = document.querySelector(".mapview-wrapper");
    MR(k).then((eA) => {
      const lA = eA.toDataURL("image/png"), TA = document.createElement("a");
      TA.href = lA, TA.download = "capture.png", TA.click();
    }).catch((eA) => {
      console.error("Error capturing the element:", eA);
    });
  };
  h = function() {
    var k = Gi(this), eA = [k.x, k.y], lA = k.k;
    if (B) {
      var TA = i.node().getBoundingClientRect(), jA = -B.drawing.width * lA + TA.width * (1 - t.extraPanArea) + B.drawing.margin.right * lA, se = TA.width * t.extraPanArea - B.drawing.margin.left * lA;
      eA[0] = _e.clamp(eA[0], jA, se);
      var xe = -B.drawing.height * lA + TA.height * (1 - t.extraPanArea) + B.drawing.margin.bottom * lA, fe = TA.height * t.extraPanArea - B.drawing.margin.top * lA;
      eA[1] = _e.clamp(eA[1], xe, fe);
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
    ae(".gene-annotation-popover").remove();
  }, iA = function() {
    var k = function(lA) {
      lA.target !== "undefined" && lA.target.tagName.toLowerCase() === "a" || ae(lA.target).closest(".genemap-advanced-menu").length > 0 || ae(lA.target).closest(".color-picker-modal").length > 0 || CA();
    }, eA = "mousedown mousewheel DOMMouseScroll touchstart ";
    ae(n).off(eA).on(eA, k), ae("body").on("click", function(lA) {
      ae(lA.target).closest(n).length < 1 && D == !0 && K();
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
    V.onAnonationLabelSelectFunction && V.onAnonationLabelSelectFunction(V.getSelectedGenes()), _A(), X(), WA(".network-btn").classed("disabled", !k);
  }, HA = function(k) {
    v ? (B = p, v = !1) : (B = { chromosomes: [k] }, v = !0), V.onAnonationLabelSelectFunction(V.getSelectedGenes()), cA(), _A(), X();
  }, uA = function() {
    _e.flatMap(
      B.chromosomes.map(function(k) {
        return k.annotations.genes.filter(function(eA) {
          return eA.selected;
        }).map(function(eA) {
          var lA = eA.link, TA = lA.substring(lA.indexOf("list="), lA.length).split("=")[1];
          return (
            /*gene.label*/
            decodeURIComponent(
              TA.replace(/\+/g, " ")
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
    k == "all" ? (U = !0, H = !0) : k == "selected" ? (U = !1, H = "true") : (U = !1, H = !1), bA(), _A(), X();
  }, R = function() {
    const eA = Gi(i.node()).k;
    var lA = eH(t.layout).width(J().width).height(J().height).scale(eA);
    B = lA.decorateGenome(B);
  }, aA = function() {
    B.chromosomes.forEach(function(k) {
      k.layout = k.layout || {}, k.layout.annotationDisplayClusters = null, k.layout.geneBandDisplayClusters = null;
    });
  }, bA = function() {
    B.chromosomes.forEach(function(k) {
      k.layout = k.layout || {}, k.layout.qtlDisplayClusters = null;
    });
  }, _A = function() {
    const eA = Gi(i.node()).k;
    R();
    var lA = u4({
      longestChromosome: B.cellLayout.longestChromosome,
      layout: B.cellLayout.geneAnnotationPosition,
      annotationMarkerSize: B.cellLayout.annotations.marker.size,
      annotationLabelSize: B.cellLayout.annotations.label.size,
      scale: eA,
      autoLabels: C,
      manualLabels: F,
      nGenesToDisplay: t.nGenesToDisplay,
      displayedFontSize: t.annotationLabelSize
    }), TA = l4({
      longestChromosome: B.cellLayout.longestChromosome,
      layout: B.cellLayout.geneAnnotationPosition,
      nClusters: 50,
      scale: eA,
      nGenesToDisplay: t.nGenesToDisplay
    }), jA = p4({
      longestChromosome: B.cellLayout.longestChromosome,
      layout: B.cellLayout.qtlAnnotationPosition,
      scale: eA,
      showAllQTLs: U,
      showSelectedQTLs: H,
      showAutoQTLLabels: U,
      showSelectedQTLLabels: H,
      annotationLabelSize: B.cellLayout.annotations.label.size
    });
    B.chromosomes.forEach(function(se) {
      se.layout = se.layout || {}, se.layout.annotationDisplayClusters || lA.computeChromosomeClusters(se), lA.layoutChromosome(se), se.layout.geneBandDisplayClusters || TA.computeChromosomeClusters(se), TA.layoutChromosome(se), se.layout.qtlDisplayClusters || jA.computeChromosomeClusters(se), jA.layoutChromosome(se);
    }), lA.computeNormalisedGeneScores(B.chromosomes);
  }, zA = function(k, eA) {
    var lA = /* @__PURE__ */ new Set(), TA = [];
    eA.chromosomes.forEach(function(xe) {
      xe.annotations.snps.forEach(function(fe) {
        lA.has(fe.trait) || fe.trait != null && TA.push({ trait: fe.trait, color: fe.color }), lA.add(fe.trait);
      });
    }), TA.length > 0 ? k.text("SNP legend: ") : k.text("");
    var jA = k.selectAll("span").data(TA), se = jA.enter().append("span").classed("key-item", !0);
    se.append("span").style("background-color", function(xe) {
      return xe.color;
    }).classed("colorbox", !0).append("svg"), se.append("span").text(function(xe) {
      return xe.trait;
    }), jA.exit().remove();
  }, JA = function(k) {
    var eA = k.append("div").attr("class", "mapview-wrapper"), lA = eA.append("svg").attr("width", t.width).attr("height", t.height).attr("class", "mapview").attr("flex", t.flex);
    l = k.append("div").append("span").attr("class", "logger").attr("id", "logbar"), f = k.append("div").attr("class", "key").attr("id", "keybar"), di.vectorEffectSupport = "vectorEffect" in lA.node().style, iA(), lA.on("contextmenu", q), lA.append("g").classed("zoom_window", !0).append("rect").classed("drawing_outline", !0), t.contentBorder && k.select(".zoom_window").append("rect").classed("drawing_margin", !0), w = 1, c = pD().scaleExtent([0.5, 60]), c.on("start", function() {
      lA.classed("dragging", !0);
    }).on("zoom", h).on("end", function() {
      lA.classed("dragging", !1);
    }), k.select("svg").call(c);
    var TA = k.append("div").attr("id", "clusterPopover").attr("class", "popover");
    return TA.append("div").attr("class", "arrow"), TA.append("h3").attr("class", "popover-title").text("Cluster"), TA.append("div").attr("class", "popover-content"), lA;
  }, X = function() {
    WA(n).select("svg").node() ? (i = WA(n).select("svg"), i.attr("width", t.width).attr("height", t.height)) : i = JA(WA(n)), R();
    var k = B.chromosomes.every(function(lA) {
      return lA.layout;
    });
    k || _A(), i.datum(B), s = i.select(".zoom_window"), wA(), t.contentBorder && QA();
    var eA = n4().onAnnotationSelectFunction(IA).onLabelSelectFunction(HA).maxAnnotationLayers(t.layout.maxAnnotationLayers).maxSnpPValue(t.maxSnpPValue).svg(i);
    s.call(eA);
  };
  function V(k) {
    k.each(function(eA) {
      var lA = this;
      n = lA, p = eA, B = p, v = !1, o || (o = c4().onTagBtnClick(T).onFitBtnClick(cA).onLabelBtnClick(gA).onQtlBtnClick(S).onNetworkBtnClick(uA).onResetBtnClick(rA).onSetNumberPerRowClick(j).initialMaxGenes(t.nGenesToDisplay).initialNPerRow(t.layout.numberPerRow).onExportBtnClick(EA).onExportAllBtnClick(OA).onExpandBtnClick(K).maxSnpPValueProperty(V.maxSnpPValue).nGenesToDisplayProperty(V.nGenesToDisplay).annotationLabelSizeProperty(V.annotationLabelSize)), WA(n).call(o), o.setNetworkButtonEnabled(!1), o.setFitButtonEnabled(!1), o.setTabButtonState("auto"), X();
    });
  }
  return V.resetZoom = cA, V.getZoom = function() {
    return !i || !i.node() ? 1 : Gi(i.node()).k;
  }, V.setZoom = function(k) {
    return !i || !i.node() || (k = _e.clamp(k, 0.5, 60), c.scaleTo(i, k)), V;
  }, V.zoomIn = function(k) {
    return !i || !i.node() || (k = k || 1.5, c.scaleBy(i, k)), V;
  }, V.zoomOut = function(k) {
    return !i || !i.node() || (k = k || 1 / 1.5, c.scaleBy(i, k)), V;
  }, V.width = function(k) {
    return arguments.length ? (t.width = k, V) : t.width;
  }, V.height = function(k) {
    return arguments.length ? (t.height = k, V) : t.height;
  }, V.layout = function(k) {
    return arguments.length ? (t.layout = _e.merge(t.layout, k), V) : t.layout;
  }, V.draw = async function(k, eA, lA, TA = !1) {
    var jA = ZI();
    if (lA)
      jA.readData(eA, lA, TA).then(function(se) {
        V._draw(k, se, TA);
      });
    else {
      const se = await jA.readData(eA, lA, TA);
      V._draw(k, se, TA);
    }
  }, V._draw = function(k, eA) {
    var lA = WA(k).selectAll("div").data(["genemap-target"]);
    lA.enter().append("div").attr("id", function(TA) {
      return TA;
    }), n = WA(k).select("#genemap-target").node(), WA(n).datum(eA).call(V), V.nGenesToDisplay(t.initialMaxGenes), cA(), zA(f, B);
  }, V.changeQtlColor = function(k, eA, lA) {
    B.chromosomes.forEach(function(TA) {
      TA.layout.qtlNodes.forEach(function(jA) {
        jA.id === k && (jA.color = eA, jA.label = lA);
      });
    }), _A(), X();
  }, V.changeColor = function(k) {
    WA("#map").style("background-color", k), _A(), X();
  }, V.redraw = function(k) {
    n = WA(k).select("#genemap-target")[0][0], M(), WA(n).call(V), CA();
  }, V.forceLayout = function() {
    return !B || !i || !i.node() || (aA(), bA(), _A(), X()), V;
  }, V.setGeneLabels = function(k) {
    n && gA(k);
  }, V.maxSnpPValue = di.Listener(t.maxSnpPValue).addListener(function(k) {
    var eA = Number(k);
    isNaN(eA) && V.maxSnpPValue(t.maxSnpPValue), t.maxSnpPValue = Number(k), _A(), X();
  }), V.nGenesToDisplay = di.Listener(t.nGenesToDisplay).addListener(
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
      var eA = WA(n).datum();
      eA.chromosomes.forEach(function(lA) {
        lA.annotations.qtls.forEach(function(TA) {
          k === "auto" ? delete TA.showLabel : TA.showLabel = k;
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
const ja = di.GeneMap().width("100%").height("100%");
function RR() {
  const A = document.getElementById("show-gene-labels"), e = A.options[A.selectedIndex].value;
  ja.setGeneLabels(e);
  const t = document.getElementById("show-qtl-labels"), n = t.options[t.selectedIndex].value;
  ja.setQtlLabels(n), ja.redraw("#map");
}
function kR() {
  ja.changeQtlColor("C6", "#000");
}
async function $R(A) {
  A && ja.resetZoom(), ja.zoomIn(1.5);
}
export {
  kR as changeQtlColor,
  ja as chart,
  $R as redraw,
  RR as updateLabel
};
