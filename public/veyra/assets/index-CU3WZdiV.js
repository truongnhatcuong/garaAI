(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const l of document.querySelectorAll('link[rel="modulepreload"]')) r(l);
  new MutationObserver((l) => {
    for (const i of l)
      if (i.type === "childList")
        for (const u of i.addedNodes)
          u.tagName === "LINK" && u.rel === "modulepreload" && r(u);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(l) {
    const i = {};
    return (
      l.integrity && (i.integrity = l.integrity),
      l.referrerPolicy && (i.referrerPolicy = l.referrerPolicy),
      l.crossOrigin === "use-credentials"
        ? (i.credentials = "include")
        : l.crossOrigin === "anonymous"
          ? (i.credentials = "omit")
          : (i.credentials = "same-origin"),
      i
    );
  }
  function r(l) {
    if (l.ep) return;
    l.ep = !0;
    const i = n(l);
    fetch(l.href, i);
  }
})();
function Tc(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default")
    ? e.default
    : e;
}
var ps = { exports: {} },
  yl = {},
  hs = { exports: {} },
  D = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var cr = Symbol.for("react.element"),
  jc = Symbol.for("react.portal"),
  Lc = Symbol.for("react.fragment"),
  Rc = Symbol.for("react.strict_mode"),
  Mc = Symbol.for("react.profiler"),
  Oc = Symbol.for("react.provider"),
  Ic = Symbol.for("react.context"),
  Dc = Symbol.for("react.forward_ref"),
  Fc = Symbol.for("react.suspense"),
  $c = Symbol.for("react.memo"),
  Uc = Symbol.for("react.lazy"),
  to = Symbol.iterator;
function Ac(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (to && e[to]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
var ms = {
    isMounted: function () {
      return !1;
    },
    enqueueForceUpdate: function () {},
    enqueueReplaceState: function () {},
    enqueueSetState: function () {},
  },
  vs = Object.assign,
  gs = {};
function xn(e, t, n) {
  ((this.props = e),
    (this.context = t),
    (this.refs = gs),
    (this.updater = n || ms));
}
xn.prototype.isReactComponent = {};
xn.prototype.setState = function (e, t) {
  if (typeof e != "object" && typeof e != "function" && e != null)
    throw Error(
      "setState(...): takes an object of state variables to update or a function which returns an object of state variables.",
    );
  this.updater.enqueueSetState(this, e, t, "setState");
};
xn.prototype.forceUpdate = function (e) {
  this.updater.enqueueForceUpdate(this, e, "forceUpdate");
};
function ys() {}
ys.prototype = xn.prototype;
function ru(e, t, n) {
  ((this.props = e),
    (this.context = t),
    (this.refs = gs),
    (this.updater = n || ms));
}
var lu = (ru.prototype = new ys());
lu.constructor = ru;
vs(lu, xn.prototype);
lu.isPureReactComponent = !0;
var no = Array.isArray,
  ws = Object.prototype.hasOwnProperty,
  iu = { current: null },
  ks = { key: !0, ref: !0, __self: !0, __source: !0 };
function Ss(e, t, n) {
  var r,
    l = {},
    i = null,
    u = null;
  if (t != null)
    for (r in (t.ref !== void 0 && (u = t.ref),
    t.key !== void 0 && (i = "" + t.key),
    t))
      ws.call(t, r) && !ks.hasOwnProperty(r) && (l[r] = t[r]);
  var o = arguments.length - 2;
  if (o === 1) l.children = n;
  else if (1 < o) {
    for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
    l.children = s;
  }
  if (e && e.defaultProps)
    for (r in ((o = e.defaultProps), o)) l[r] === void 0 && (l[r] = o[r]);
  return {
    $$typeof: cr,
    type: e,
    key: i,
    ref: u,
    props: l,
    _owner: iu.current,
  };
}
function Vc(e, t) {
  return {
    $$typeof: cr,
    type: e.type,
    key: t,
    ref: e.ref,
    props: e.props,
    _owner: e._owner,
  };
}
function uu(e) {
  return typeof e == "object" && e !== null && e.$$typeof === cr;
}
function Bc(e) {
  var t = { "=": "=0", ":": "=2" };
  return (
    "$" +
    e.replace(/[=:]/g, function (n) {
      return t[n];
    })
  );
}
var ro = /\/+/g;
function Dl(e, t) {
  return typeof e == "object" && e !== null && e.key != null
    ? Bc("" + e.key)
    : t.toString(36);
}
function Ir(e, t, n, r, l) {
  var i = typeof e;
  (i === "undefined" || i === "boolean") && (e = null);
  var u = !1;
  if (e === null) u = !0;
  else
    switch (i) {
      case "string":
      case "number":
        u = !0;
        break;
      case "object":
        switch (e.$$typeof) {
          case cr:
          case jc:
            u = !0;
        }
    }
  if (u)
    return (
      (u = e),
      (l = l(u)),
      (e = r === "" ? "." + Dl(u, 0) : r),
      no(l)
        ? ((n = ""),
          e != null && (n = e.replace(ro, "$&/") + "/"),
          Ir(l, t, n, "", function (c) {
            return c;
          }))
        : l != null &&
          (uu(l) &&
            (l = Vc(
              l,
              n +
                (!l.key || (u && u.key === l.key)
                  ? ""
                  : ("" + l.key).replace(ro, "$&/") + "/") +
                e,
            )),
          t.push(l)),
      1
    );
  if (((u = 0), (r = r === "" ? "." : r + ":"), no(e)))
    for (var o = 0; o < e.length; o++) {
      i = e[o];
      var s = r + Dl(i, o);
      u += Ir(i, t, n, s, l);
    }
  else if (((s = Ac(e)), typeof s == "function"))
    for (e = s.call(e), o = 0; !(i = e.next()).done; )
      ((i = i.value), (s = r + Dl(i, o++)), (u += Ir(i, t, n, s, l)));
  else if (i === "object")
    throw (
      (t = String(e)),
      Error(
        "Objects are not valid as a React child (found: " +
          (t === "[object Object]"
            ? "object with keys {" + Object.keys(e).join(", ") + "}"
            : t) +
          "). If you meant to render a collection of children, use an array instead.",
      )
    );
  return u;
}
function yr(e, t, n) {
  if (e == null) return e;
  var r = [],
    l = 0;
  return (
    Ir(e, r, "", "", function (i) {
      return t.call(n, i, l++);
    }),
    r
  );
}
function Hc(e) {
  if (e._status === -1) {
    var t = e._result;
    ((t = t()),
      t.then(
        function (n) {
          (e._status === 0 || e._status === -1) &&
            ((e._status = 1), (e._result = n));
        },
        function (n) {
          (e._status === 0 || e._status === -1) &&
            ((e._status = 2), (e._result = n));
        },
      ),
      e._status === -1 && ((e._status = 0), (e._result = t)));
  }
  if (e._status === 1) return e._result.default;
  throw e._result;
}
var he = { current: null },
  Dr = { transition: null },
  Wc = {
    ReactCurrentDispatcher: he,
    ReactCurrentBatchConfig: Dr,
    ReactCurrentOwner: iu,
  };
function xs() {
  throw Error("act(...) is not supported in production builds of React.");
}
D.Children = {
  map: yr,
  forEach: function (e, t, n) {
    yr(
      e,
      function () {
        t.apply(this, arguments);
      },
      n,
    );
  },
  count: function (e) {
    var t = 0;
    return (
      yr(e, function () {
        t++;
      }),
      t
    );
  },
  toArray: function (e) {
    return (
      yr(e, function (t) {
        return t;
      }) || []
    );
  },
  only: function (e) {
    if (!uu(e))
      throw Error(
        "React.Children.only expected to receive a single React element child.",
      );
    return e;
  },
};
D.Component = xn;
D.Fragment = Lc;
D.Profiler = Mc;
D.PureComponent = ru;
D.StrictMode = Rc;
D.Suspense = Fc;
D.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Wc;
D.act = xs;
D.cloneElement = function (e, t, n) {
  if (e == null)
    throw Error(
      "React.cloneElement(...): The argument must be a React element, but you passed " +
        e +
        ".",
    );
  var r = vs({}, e.props),
    l = e.key,
    i = e.ref,
    u = e._owner;
  if (t != null) {
    if (
      (t.ref !== void 0 && ((i = t.ref), (u = iu.current)),
      t.key !== void 0 && (l = "" + t.key),
      e.type && e.type.defaultProps)
    )
      var o = e.type.defaultProps;
    for (s in t)
      ws.call(t, s) &&
        !ks.hasOwnProperty(s) &&
        (r[s] = t[s] === void 0 && o !== void 0 ? o[s] : t[s]);
  }
  var s = arguments.length - 2;
  if (s === 1) r.children = n;
  else if (1 < s) {
    o = Array(s);
    for (var c = 0; c < s; c++) o[c] = arguments[c + 2];
    r.children = o;
  }
  return { $$typeof: cr, type: e.type, key: l, ref: i, props: r, _owner: u };
};
D.createContext = function (e) {
  return (
    (e = {
      $$typeof: Ic,
      _currentValue: e,
      _currentValue2: e,
      _threadCount: 0,
      Provider: null,
      Consumer: null,
      _defaultValue: null,
      _globalName: null,
    }),
    (e.Provider = { $$typeof: Oc, _context: e }),
    (e.Consumer = e)
  );
};
D.createElement = Ss;
D.createFactory = function (e) {
  var t = Ss.bind(null, e);
  return ((t.type = e), t);
};
D.createRef = function () {
  return { current: null };
};
D.forwardRef = function (e) {
  return { $$typeof: Dc, render: e };
};
D.isValidElement = uu;
D.lazy = function (e) {
  return { $$typeof: Uc, _payload: { _status: -1, _result: e }, _init: Hc };
};
D.memo = function (e, t) {
  return { $$typeof: $c, type: e, compare: t === void 0 ? null : t };
};
D.startTransition = function (e) {
  var t = Dr.transition;
  Dr.transition = {};
  try {
    e();
  } finally {
    Dr.transition = t;
  }
};
D.unstable_act = xs;
D.useCallback = function (e, t) {
  return he.current.useCallback(e, t);
};
D.useContext = function (e) {
  return he.current.useContext(e);
};
D.useDebugValue = function () {};
D.useDeferredValue = function (e) {
  return he.current.useDeferredValue(e);
};
D.useEffect = function (e, t) {
  return he.current.useEffect(e, t);
};
D.useId = function () {
  return he.current.useId();
};
D.useImperativeHandle = function (e, t, n) {
  return he.current.useImperativeHandle(e, t, n);
};
D.useInsertionEffect = function (e, t) {
  return he.current.useInsertionEffect(e, t);
};
D.useLayoutEffect = function (e, t) {
  return he.current.useLayoutEffect(e, t);
};
D.useMemo = function (e, t) {
  return he.current.useMemo(e, t);
};
D.useReducer = function (e, t, n) {
  return he.current.useReducer(e, t, n);
};
D.useRef = function (e) {
  return he.current.useRef(e);
};
D.useState = function (e) {
  return he.current.useState(e);
};
D.useSyncExternalStore = function (e, t, n) {
  return he.current.useSyncExternalStore(e, t, n);
};
D.useTransition = function () {
  return he.current.useTransition();
};
D.version = "18.3.1";
hs.exports = D;
var O = hs.exports;
const Qc = Tc(O);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Kc = O,
  Xc = Symbol.for("react.element"),
  Yc = Symbol.for("react.fragment"),
  Gc = Object.prototype.hasOwnProperty,
  Zc = Kc.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
  Jc = { key: !0, ref: !0, __self: !0, __source: !0 };
function Es(e, t, n) {
  var r,
    l = {},
    i = null,
    u = null;
  (n !== void 0 && (i = "" + n),
    t.key !== void 0 && (i = "" + t.key),
    t.ref !== void 0 && (u = t.ref));
  for (r in t) Gc.call(t, r) && !Jc.hasOwnProperty(r) && (l[r] = t[r]);
  if (e && e.defaultProps)
    for (r in ((t = e.defaultProps), t)) l[r] === void 0 && (l[r] = t[r]);
  return {
    $$typeof: Xc,
    type: e,
    key: i,
    ref: u,
    props: l,
    _owner: Zc.current,
  };
}
yl.Fragment = Yc;
yl.jsx = Es;
yl.jsxs = Es;
ps.exports = yl;
var g = ps.exports,
  ai = {},
  Cs = { exports: {} },
  Pe = {},
  Ns = { exports: {} },
  _s = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ (function (e) {
  function t(C, j) {
    var M = C.length;
    C.push(j);
    e: for (; 0 < M; ) {
      var B = (M - 1) >>> 1,
        X = C[B];
      if (0 < l(X, j)) ((C[B] = j), (C[M] = X), (M = B));
      else break e;
    }
  }
  function n(C) {
    return C.length === 0 ? null : C[0];
  }
  function r(C) {
    if (C.length === 0) return null;
    var j = C[0],
      M = C.pop();
    if (M !== j) {
      C[0] = M;
      e: for (var B = 0, X = C.length, ct = X >>> 1; B < ct; ) {
        var We = 2 * (B + 1) - 1,
          Kt = C[We],
          Se = We + 1,
          Xt = C[Se];
        if (0 > l(Kt, M))
          Se < X && 0 > l(Xt, Kt)
            ? ((C[B] = Xt), (C[Se] = M), (B = Se))
            : ((C[B] = Kt), (C[We] = M), (B = We));
        else if (Se < X && 0 > l(Xt, M)) ((C[B] = Xt), (C[Se] = M), (B = Se));
        else break e;
      }
    }
    return j;
  }
  function l(C, j) {
    var M = C.sortIndex - j.sortIndex;
    return M !== 0 ? M : C.id - j.id;
  }
  if (typeof performance == "object" && typeof performance.now == "function") {
    var i = performance;
    e.unstable_now = function () {
      return i.now();
    };
  } else {
    var u = Date,
      o = u.now();
    e.unstable_now = function () {
      return u.now() - o;
    };
  }
  var s = [],
    c = [],
    m = 1,
    h = null,
    p = 3,
    k = !1,
    S = !1,
    x = !1,
    L = typeof setTimeout == "function" ? setTimeout : null,
    f = typeof clearTimeout == "function" ? clearTimeout : null,
    a = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" &&
    navigator.scheduling !== void 0 &&
    navigator.scheduling.isInputPending !== void 0 &&
    navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function d(C) {
    for (var j = n(c); j !== null; ) {
      if (j.callback === null) r(c);
      else if (j.startTime <= C)
        (r(c), (j.sortIndex = j.expirationTime), t(s, j));
      else break;
      j = n(c);
    }
  }
  function v(C) {
    if (((x = !1), d(C), !S))
      if (n(s) !== null) ((S = !0), He(E));
      else {
        var j = n(c);
        j !== null && qe(v, j.startTime - C);
      }
  }
  function E(C, j) {
    ((S = !1), x && ((x = !1), f(P), (P = -1)), (k = !0));
    var M = p;
    try {
      for (
        d(j), h = n(s);
        h !== null && (!(h.expirationTime > j) || (C && !V()));
      ) {
        var B = h.callback;
        if (typeof B == "function") {
          ((h.callback = null), (p = h.priorityLevel));
          var X = B(h.expirationTime <= j);
          ((j = e.unstable_now()),
            typeof X == "function" ? (h.callback = X) : h === n(s) && r(s),
            d(j));
        } else r(s);
        h = n(s);
      }
      if (h !== null) var ct = !0;
      else {
        var We = n(c);
        (We !== null && qe(v, We.startTime - j), (ct = !1));
      }
      return ct;
    } finally {
      ((h = null), (p = M), (k = !1));
    }
  }
  var _ = !1,
    w = null,
    P = -1,
    R = 5,
    I = -1;
  function V() {
    return !(e.unstable_now() - I < R);
  }
  function Te() {
    if (w !== null) {
      var C = e.unstable_now();
      I = C;
      var j = !0;
      try {
        j = w(!0, C);
      } finally {
        j ? Ze() : ((_ = !1), (w = null));
      }
    } else _ = !1;
  }
  var Ze;
  if (typeof a == "function")
    Ze = function () {
      a(Te);
    };
  else if (typeof MessageChannel < "u") {
    var Je = new MessageChannel(),
      at = Je.port2;
    ((Je.port1.onmessage = Te),
      (Ze = function () {
        at.postMessage(null);
      }));
  } else
    Ze = function () {
      L(Te, 0);
    };
  function He(C) {
    ((w = C), _ || ((_ = !0), Ze()));
  }
  function qe(C, j) {
    P = L(function () {
      C(e.unstable_now());
    }, j);
  }
  ((e.unstable_IdlePriority = 5),
    (e.unstable_ImmediatePriority = 1),
    (e.unstable_LowPriority = 4),
    (e.unstable_NormalPriority = 3),
    (e.unstable_Profiling = null),
    (e.unstable_UserBlockingPriority = 2),
    (e.unstable_cancelCallback = function (C) {
      C.callback = null;
    }),
    (e.unstable_continueExecution = function () {
      S || k || ((S = !0), He(E));
    }),
    (e.unstable_forceFrameRate = function (C) {
      0 > C || 125 < C
        ? console.error(
            "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
          )
        : (R = 0 < C ? Math.floor(1e3 / C) : 5);
    }),
    (e.unstable_getCurrentPriorityLevel = function () {
      return p;
    }),
    (e.unstable_getFirstCallbackNode = function () {
      return n(s);
    }),
    (e.unstable_next = function (C) {
      switch (p) {
        case 1:
        case 2:
        case 3:
          var j = 3;
          break;
        default:
          j = p;
      }
      var M = p;
      p = j;
      try {
        return C();
      } finally {
        p = M;
      }
    }),
    (e.unstable_pauseExecution = function () {}),
    (e.unstable_requestPaint = function () {}),
    (e.unstable_runWithPriority = function (C, j) {
      switch (C) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          C = 3;
      }
      var M = p;
      p = C;
      try {
        return j();
      } finally {
        p = M;
      }
    }),
    (e.unstable_scheduleCallback = function (C, j, M) {
      var B = e.unstable_now();
      switch (
        (typeof M == "object" && M !== null
          ? ((M = M.delay), (M = typeof M == "number" && 0 < M ? B + M : B))
          : (M = B),
        C)
      ) {
        case 1:
          var X = -1;
          break;
        case 2:
          X = 250;
          break;
        case 5:
          X = 1073741823;
          break;
        case 4:
          X = 1e4;
          break;
        default:
          X = 5e3;
      }
      return (
        (X = M + X),
        (C = {
          id: m++,
          callback: j,
          priorityLevel: C,
          startTime: M,
          expirationTime: X,
          sortIndex: -1,
        }),
        M > B
          ? ((C.sortIndex = M),
            t(c, C),
            n(s) === null &&
              C === n(c) &&
              (x ? (f(P), (P = -1)) : (x = !0), qe(v, M - B)))
          : ((C.sortIndex = X), t(s, C), S || k || ((S = !0), He(E))),
        C
      );
    }),
    (e.unstable_shouldYield = V),
    (e.unstable_wrapCallback = function (C) {
      var j = p;
      return function () {
        var M = p;
        p = j;
        try {
          return C.apply(this, arguments);
        } finally {
          p = M;
        }
      };
    }));
})(_s);
Ns.exports = _s;
var qc = Ns.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var bc = O,
  _e = qc;
function y(e) {
  for (
    var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1;
    n < arguments.length;
    n++
  )
    t += "&args[]=" + encodeURIComponent(arguments[n]);
  return (
    "Minified React error #" +
    e +
    "; visit " +
    t +
    " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
  );
}
var Ps = new Set(),
  Xn = {};
function Wt(e, t) {
  (mn(e, t), mn(e + "Capture", t));
}
function mn(e, t) {
  for (Xn[e] = t, e = 0; e < t.length; e++) Ps.add(t[e]);
}
var lt = !(
    typeof window > "u" ||
    typeof window.document > "u" ||
    typeof window.document.createElement > "u"
  ),
  ci = Object.prototype.hasOwnProperty,
  ef =
    /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
  lo = {},
  io = {};
function tf(e) {
  return ci.call(io, e)
    ? !0
    : ci.call(lo, e)
      ? !1
      : ef.test(e)
        ? (io[e] = !0)
        : ((lo[e] = !0), !1);
}
function nf(e, t, n, r) {
  if (n !== null && n.type === 0) return !1;
  switch (typeof t) {
    case "function":
    case "symbol":
      return !0;
    case "boolean":
      return r
        ? !1
        : n !== null
          ? !n.acceptsBooleans
          : ((e = e.toLowerCase().slice(0, 5)), e !== "data-" && e !== "aria-");
    default:
      return !1;
  }
}
function rf(e, t, n, r) {
  if (t === null || typeof t > "u" || nf(e, t, n, r)) return !0;
  if (r) return !1;
  if (n !== null)
    switch (n.type) {
      case 3:
        return !t;
      case 4:
        return t === !1;
      case 5:
        return isNaN(t);
      case 6:
        return isNaN(t) || 1 > t;
    }
  return !1;
}
function me(e, t, n, r, l, i, u) {
  ((this.acceptsBooleans = t === 2 || t === 3 || t === 4),
    (this.attributeName = r),
    (this.attributeNamespace = l),
    (this.mustUseProperty = n),
    (this.propertyName = e),
    (this.type = t),
    (this.sanitizeURL = i),
    (this.removeEmptyString = u));
}
var oe = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style"
  .split(" ")
  .forEach(function (e) {
    oe[e] = new me(e, 0, !1, e, null, !1, !1);
  });
[
  ["acceptCharset", "accept-charset"],
  ["className", "class"],
  ["htmlFor", "for"],
  ["httpEquiv", "http-equiv"],
].forEach(function (e) {
  var t = e[0];
  oe[t] = new me(t, 1, !1, e[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function (e) {
  oe[e] = new me(e, 2, !1, e.toLowerCase(), null, !1, !1);
});
[
  "autoReverse",
  "externalResourcesRequired",
  "focusable",
  "preserveAlpha",
].forEach(function (e) {
  oe[e] = new me(e, 2, !1, e, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope"
  .split(" ")
  .forEach(function (e) {
    oe[e] = new me(e, 3, !1, e.toLowerCase(), null, !1, !1);
  });
["checked", "multiple", "muted", "selected"].forEach(function (e) {
  oe[e] = new me(e, 3, !0, e, null, !1, !1);
});
["capture", "download"].forEach(function (e) {
  oe[e] = new me(e, 4, !1, e, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function (e) {
  oe[e] = new me(e, 6, !1, e, null, !1, !1);
});
["rowSpan", "start"].forEach(function (e) {
  oe[e] = new me(e, 5, !1, e.toLowerCase(), null, !1, !1);
});
var ou = /[\-:]([a-z])/g;
function su(e) {
  return e[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(ou, su);
    oe[t] = new me(t, 1, !1, e, null, !1, !1);
  });
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(ou, su);
    oe[t] = new me(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  });
["xml:base", "xml:lang", "xml:space"].forEach(function (e) {
  var t = e.replace(ou, su);
  oe[t] = new me(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function (e) {
  oe[e] = new me(e, 1, !1, e.toLowerCase(), null, !1, !1);
});
oe.xlinkHref = new me(
  "xlinkHref",
  1,
  !1,
  "xlink:href",
  "http://www.w3.org/1999/xlink",
  !0,
  !1,
);
["src", "href", "action", "formAction"].forEach(function (e) {
  oe[e] = new me(e, 1, !1, e.toLowerCase(), null, !0, !0);
});
function au(e, t, n, r) {
  var l = oe.hasOwnProperty(t) ? oe[t] : null;
  (l !== null
    ? l.type !== 0
    : r ||
      !(2 < t.length) ||
      (t[0] !== "o" && t[0] !== "O") ||
      (t[1] !== "n" && t[1] !== "N")) &&
    (rf(t, n, l, r) && (n = null),
    r || l === null
      ? tf(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n))
      : l.mustUseProperty
        ? (e[l.propertyName] = n === null ? (l.type === 3 ? !1 : "") : n)
        : ((t = l.attributeName),
          (r = l.attributeNamespace),
          n === null
            ? e.removeAttribute(t)
            : ((l = l.type),
              (n = l === 3 || (l === 4 && n === !0) ? "" : "" + n),
              r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
}
var st = bc.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  wr = Symbol.for("react.element"),
  Gt = Symbol.for("react.portal"),
  Zt = Symbol.for("react.fragment"),
  cu = Symbol.for("react.strict_mode"),
  fi = Symbol.for("react.profiler"),
  zs = Symbol.for("react.provider"),
  Ts = Symbol.for("react.context"),
  fu = Symbol.for("react.forward_ref"),
  di = Symbol.for("react.suspense"),
  pi = Symbol.for("react.suspense_list"),
  du = Symbol.for("react.memo"),
  dt = Symbol.for("react.lazy"),
  js = Symbol.for("react.offscreen"),
  uo = Symbol.iterator;
function _n(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (uo && e[uo]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
var Z = Object.assign,
  Fl;
function On(e) {
  if (Fl === void 0)
    try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      Fl = (t && t[1]) || "";
    }
  return (
    `
` +
    Fl +
    e
  );
}
var $l = !1;
function Ul(e, t) {
  if (!e || $l) return "";
  $l = !0;
  var n = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (t)
      if (
        ((t = function () {
          throw Error();
        }),
        Object.defineProperty(t.prototype, "props", {
          set: function () {
            throw Error();
          },
        }),
        typeof Reflect == "object" && Reflect.construct)
      ) {
        try {
          Reflect.construct(t, []);
        } catch (c) {
          var r = c;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (c) {
          r = c;
        }
        e.call(t.prototype);
      }
    else {
      try {
        throw Error();
      } catch (c) {
        r = c;
      }
      e();
    }
  } catch (c) {
    if (c && r && typeof c.stack == "string") {
      for (
        var l = c.stack.split(`
`),
          i = r.stack.split(`
`),
          u = l.length - 1,
          o = i.length - 1;
        1 <= u && 0 <= o && l[u] !== i[o];
      )
        o--;
      for (; 1 <= u && 0 <= o; u--, o--)
        if (l[u] !== i[o]) {
          if (u !== 1 || o !== 1)
            do
              if ((u--, o--, 0 > o || l[u] !== i[o])) {
                var s =
                  `
` + l[u].replace(" at new ", " at ");
                return (
                  e.displayName &&
                    s.includes("<anonymous>") &&
                    (s = s.replace("<anonymous>", e.displayName)),
                  s
                );
              }
            while (1 <= u && 0 <= o);
          break;
        }
    }
  } finally {
    (($l = !1), (Error.prepareStackTrace = n));
  }
  return (e = e ? e.displayName || e.name : "") ? On(e) : "";
}
function lf(e) {
  switch (e.tag) {
    case 5:
      return On(e.type);
    case 16:
      return On("Lazy");
    case 13:
      return On("Suspense");
    case 19:
      return On("SuspenseList");
    case 0:
    case 2:
    case 15:
      return ((e = Ul(e.type, !1)), e);
    case 11:
      return ((e = Ul(e.type.render, !1)), e);
    case 1:
      return ((e = Ul(e.type, !0)), e);
    default:
      return "";
  }
}
function hi(e) {
  if (e == null) return null;
  if (typeof e == "function") return e.displayName || e.name || null;
  if (typeof e == "string") return e;
  switch (e) {
    case Zt:
      return "Fragment";
    case Gt:
      return "Portal";
    case fi:
      return "Profiler";
    case cu:
      return "StrictMode";
    case di:
      return "Suspense";
    case pi:
      return "SuspenseList";
  }
  if (typeof e == "object")
    switch (e.$$typeof) {
      case Ts:
        return (e.displayName || "Context") + ".Consumer";
      case zs:
        return (e._context.displayName || "Context") + ".Provider";
      case fu:
        var t = e.render;
        return (
          (e = e.displayName),
          e ||
            ((e = t.displayName || t.name || ""),
            (e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")),
          e
        );
      case du:
        return (
          (t = e.displayName || null),
          t !== null ? t : hi(e.type) || "Memo"
        );
      case dt:
        ((t = e._payload), (e = e._init));
        try {
          return hi(e(t));
        } catch {}
    }
  return null;
}
function uf(e) {
  var t = e.type;
  switch (e.tag) {
    case 24:
      return "Cache";
    case 9:
      return (t.displayName || "Context") + ".Consumer";
    case 10:
      return (t._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return (
        (e = t.render),
        (e = e.displayName || e.name || ""),
        t.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")
      );
    case 7:
      return "Fragment";
    case 5:
      return t;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return hi(t);
    case 8:
      return t === cu ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if (typeof t == "function") return t.displayName || t.name || null;
      if (typeof t == "string") return t;
  }
  return null;
}
function _t(e) {
  switch (typeof e) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return e;
    case "object":
      return e;
    default:
      return "";
  }
}
function Ls(e) {
  var t = e.type;
  return (
    (e = e.nodeName) &&
    e.toLowerCase() === "input" &&
    (t === "checkbox" || t === "radio")
  );
}
function of(e) {
  var t = Ls(e) ? "checked" : "value",
    n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t),
    r = "" + e[t];
  if (
    !e.hasOwnProperty(t) &&
    typeof n < "u" &&
    typeof n.get == "function" &&
    typeof n.set == "function"
  ) {
    var l = n.get,
      i = n.set;
    return (
      Object.defineProperty(e, t, {
        configurable: !0,
        get: function () {
          return l.call(this);
        },
        set: function (u) {
          ((r = "" + u), i.call(this, u));
        },
      }),
      Object.defineProperty(e, t, { enumerable: n.enumerable }),
      {
        getValue: function () {
          return r;
        },
        setValue: function (u) {
          r = "" + u;
        },
        stopTracking: function () {
          ((e._valueTracker = null), delete e[t]);
        },
      }
    );
  }
}
function kr(e) {
  e._valueTracker || (e._valueTracker = of(e));
}
function Rs(e) {
  if (!e) return !1;
  var t = e._valueTracker;
  if (!t) return !0;
  var n = t.getValue(),
    r = "";
  return (
    e && (r = Ls(e) ? (e.checked ? "true" : "false") : e.value),
    (e = r),
    e !== n ? (t.setValue(e), !0) : !1
  );
}
function Yr(e) {
  if (((e = e || (typeof document < "u" ? document : void 0)), typeof e > "u"))
    return null;
  try {
    return e.activeElement || e.body;
  } catch {
    return e.body;
  }
}
function mi(e, t) {
  var n = t.checked;
  return Z({}, t, {
    defaultChecked: void 0,
    defaultValue: void 0,
    value: void 0,
    checked: n ?? e._wrapperState.initialChecked,
  });
}
function oo(e, t) {
  var n = t.defaultValue == null ? "" : t.defaultValue,
    r = t.checked != null ? t.checked : t.defaultChecked;
  ((n = _t(t.value != null ? t.value : n)),
    (e._wrapperState = {
      initialChecked: r,
      initialValue: n,
      controlled:
        t.type === "checkbox" || t.type === "radio"
          ? t.checked != null
          : t.value != null,
    }));
}
function Ms(e, t) {
  ((t = t.checked), t != null && au(e, "checked", t, !1));
}
function vi(e, t) {
  Ms(e, t);
  var n = _t(t.value),
    r = t.type;
  if (n != null)
    r === "number"
      ? ((n === 0 && e.value === "") || e.value != n) && (e.value = "" + n)
      : e.value !== "" + n && (e.value = "" + n);
  else if (r === "submit" || r === "reset") {
    e.removeAttribute("value");
    return;
  }
  (t.hasOwnProperty("value")
    ? gi(e, t.type, n)
    : t.hasOwnProperty("defaultValue") && gi(e, t.type, _t(t.defaultValue)),
    t.checked == null &&
      t.defaultChecked != null &&
      (e.defaultChecked = !!t.defaultChecked));
}
function so(e, t, n) {
  if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
    var r = t.type;
    if (
      !(
        (r !== "submit" && r !== "reset") ||
        (t.value !== void 0 && t.value !== null)
      )
    )
      return;
    ((t = "" + e._wrapperState.initialValue),
      n || t === e.value || (e.value = t),
      (e.defaultValue = t));
  }
  ((n = e.name),
    n !== "" && (e.name = ""),
    (e.defaultChecked = !!e._wrapperState.initialChecked),
    n !== "" && (e.name = n));
}
function gi(e, t, n) {
  (t !== "number" || Yr(e.ownerDocument) !== e) &&
    (n == null
      ? (e.defaultValue = "" + e._wrapperState.initialValue)
      : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
}
var In = Array.isArray;
function an(e, t, n, r) {
  if (((e = e.options), t)) {
    t = {};
    for (var l = 0; l < n.length; l++) t["$" + n[l]] = !0;
    for (n = 0; n < e.length; n++)
      ((l = t.hasOwnProperty("$" + e[n].value)),
        e[n].selected !== l && (e[n].selected = l),
        l && r && (e[n].defaultSelected = !0));
  } else {
    for (n = "" + _t(n), t = null, l = 0; l < e.length; l++) {
      if (e[l].value === n) {
        ((e[l].selected = !0), r && (e[l].defaultSelected = !0));
        return;
      }
      t !== null || e[l].disabled || (t = e[l]);
    }
    t !== null && (t.selected = !0);
  }
}
function yi(e, t) {
  if (t.dangerouslySetInnerHTML != null) throw Error(y(91));
  return Z({}, t, {
    value: void 0,
    defaultValue: void 0,
    children: "" + e._wrapperState.initialValue,
  });
}
function ao(e, t) {
  var n = t.value;
  if (n == null) {
    if (((n = t.children), (t = t.defaultValue), n != null)) {
      if (t != null) throw Error(y(92));
      if (In(n)) {
        if (1 < n.length) throw Error(y(93));
        n = n[0];
      }
      t = n;
    }
    (t == null && (t = ""), (n = t));
  }
  e._wrapperState = { initialValue: _t(n) };
}
function Os(e, t) {
  var n = _t(t.value),
    r = _t(t.defaultValue);
  (n != null &&
    ((n = "" + n),
    n !== e.value && (e.value = n),
    t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)),
    r != null && (e.defaultValue = "" + r));
}
function co(e) {
  var t = e.textContent;
  t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
}
function Is(e) {
  switch (e) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function wi(e, t) {
  return e == null || e === "http://www.w3.org/1999/xhtml"
    ? Is(t)
    : e === "http://www.w3.org/2000/svg" && t === "foreignObject"
      ? "http://www.w3.org/1999/xhtml"
      : e;
}
var Sr,
  Ds = (function (e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction
      ? function (t, n, r, l) {
          MSApp.execUnsafeLocalFunction(function () {
            return e(t, n, r, l);
          });
        }
      : e;
  })(function (e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e)
      e.innerHTML = t;
    else {
      for (
        Sr = Sr || document.createElement("div"),
          Sr.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>",
          t = Sr.firstChild;
        e.firstChild;
      )
        e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
function Yn(e, t) {
  if (t) {
    var n = e.firstChild;
    if (n && n === e.lastChild && n.nodeType === 3) {
      n.nodeValue = t;
      return;
    }
  }
  e.textContent = t;
}
var $n = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0,
  },
  sf = ["Webkit", "ms", "Moz", "O"];
Object.keys($n).forEach(function (e) {
  sf.forEach(function (t) {
    ((t = t + e.charAt(0).toUpperCase() + e.substring(1)), ($n[t] = $n[e]));
  });
});
function Fs(e, t, n) {
  return t == null || typeof t == "boolean" || t === ""
    ? ""
    : n || typeof t != "number" || t === 0 || ($n.hasOwnProperty(e) && $n[e])
      ? ("" + t).trim()
      : t + "px";
}
function $s(e, t) {
  e = e.style;
  for (var n in t)
    if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0,
        l = Fs(n, t[n], r);
      (n === "float" && (n = "cssFloat"), r ? e.setProperty(n, l) : (e[n] = l));
    }
}
var af = Z(
  { menuitem: !0 },
  {
    area: !0,
    base: !0,
    br: !0,
    col: !0,
    embed: !0,
    hr: !0,
    img: !0,
    input: !0,
    keygen: !0,
    link: !0,
    meta: !0,
    param: !0,
    source: !0,
    track: !0,
    wbr: !0,
  },
);
function ki(e, t) {
  if (t) {
    if (af[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
      throw Error(y(137, e));
    if (t.dangerouslySetInnerHTML != null) {
      if (t.children != null) throw Error(y(60));
      if (
        typeof t.dangerouslySetInnerHTML != "object" ||
        !("__html" in t.dangerouslySetInnerHTML)
      )
        throw Error(y(61));
    }
    if (t.style != null && typeof t.style != "object") throw Error(y(62));
  }
}
function Si(e, t) {
  if (e.indexOf("-") === -1) return typeof t.is == "string";
  switch (e) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return !1;
    default:
      return !0;
  }
}
var xi = null;
function pu(e) {
  return (
    (e = e.target || e.srcElement || window),
    e.correspondingUseElement && (e = e.correspondingUseElement),
    e.nodeType === 3 ? e.parentNode : e
  );
}
var Ei = null,
  cn = null,
  fn = null;
function fo(e) {
  if ((e = pr(e))) {
    if (typeof Ei != "function") throw Error(y(280));
    var t = e.stateNode;
    t && ((t = El(t)), Ei(e.stateNode, e.type, t));
  }
}
function Us(e) {
  cn ? (fn ? fn.push(e) : (fn = [e])) : (cn = e);
}
function As() {
  if (cn) {
    var e = cn,
      t = fn;
    if (((fn = cn = null), fo(e), t)) for (e = 0; e < t.length; e++) fo(t[e]);
  }
}
function Vs(e, t) {
  return e(t);
}
function Bs() {}
var Al = !1;
function Hs(e, t, n) {
  if (Al) return e(t, n);
  Al = !0;
  try {
    return Vs(e, t, n);
  } finally {
    ((Al = !1), (cn !== null || fn !== null) && (Bs(), As()));
  }
}
function Gn(e, t) {
  var n = e.stateNode;
  if (n === null) return null;
  var r = El(n);
  if (r === null) return null;
  n = r[t];
  e: switch (t) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      ((r = !r.disabled) ||
        ((e = e.type),
        (r = !(
          e === "button" ||
          e === "input" ||
          e === "select" ||
          e === "textarea"
        ))),
        (e = !r));
      break e;
    default:
      e = !1;
  }
  if (e) return null;
  if (n && typeof n != "function") throw Error(y(231, t, typeof n));
  return n;
}
var Ci = !1;
if (lt)
  try {
    var Pn = {};
    (Object.defineProperty(Pn, "passive", {
      get: function () {
        Ci = !0;
      },
    }),
      window.addEventListener("test", Pn, Pn),
      window.removeEventListener("test", Pn, Pn));
  } catch {
    Ci = !1;
  }
function cf(e, t, n, r, l, i, u, o, s) {
  var c = Array.prototype.slice.call(arguments, 3);
  try {
    t.apply(n, c);
  } catch (m) {
    this.onError(m);
  }
}
var Un = !1,
  Gr = null,
  Zr = !1,
  Ni = null,
  ff = {
    onError: function (e) {
      ((Un = !0), (Gr = e));
    },
  };
function df(e, t, n, r, l, i, u, o, s) {
  ((Un = !1), (Gr = null), cf.apply(ff, arguments));
}
function pf(e, t, n, r, l, i, u, o, s) {
  if ((df.apply(this, arguments), Un)) {
    if (Un) {
      var c = Gr;
      ((Un = !1), (Gr = null));
    } else throw Error(y(198));
    Zr || ((Zr = !0), (Ni = c));
  }
}
function Qt(e) {
  var t = e,
    n = e;
  if (e.alternate) for (; t.return; ) t = t.return;
  else {
    e = t;
    do ((t = e), t.flags & 4098 && (n = t.return), (e = t.return));
    while (e);
  }
  return t.tag === 3 ? n : null;
}
function Ws(e) {
  if (e.tag === 13) {
    var t = e.memoizedState;
    if (
      (t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)),
      t !== null)
    )
      return t.dehydrated;
  }
  return null;
}
function po(e) {
  if (Qt(e) !== e) throw Error(y(188));
}
function hf(e) {
  var t = e.alternate;
  if (!t) {
    if (((t = Qt(e)), t === null)) throw Error(y(188));
    return t !== e ? null : e;
  }
  for (var n = e, r = t; ; ) {
    var l = n.return;
    if (l === null) break;
    var i = l.alternate;
    if (i === null) {
      if (((r = l.return), r !== null)) {
        n = r;
        continue;
      }
      break;
    }
    if (l.child === i.child) {
      for (i = l.child; i; ) {
        if (i === n) return (po(l), e);
        if (i === r) return (po(l), t);
        i = i.sibling;
      }
      throw Error(y(188));
    }
    if (n.return !== r.return) ((n = l), (r = i));
    else {
      for (var u = !1, o = l.child; o; ) {
        if (o === n) {
          ((u = !0), (n = l), (r = i));
          break;
        }
        if (o === r) {
          ((u = !0), (r = l), (n = i));
          break;
        }
        o = o.sibling;
      }
      if (!u) {
        for (o = i.child; o; ) {
          if (o === n) {
            ((u = !0), (n = i), (r = l));
            break;
          }
          if (o === r) {
            ((u = !0), (r = i), (n = l));
            break;
          }
          o = o.sibling;
        }
        if (!u) throw Error(y(189));
      }
    }
    if (n.alternate !== r) throw Error(y(190));
  }
  if (n.tag !== 3) throw Error(y(188));
  return n.stateNode.current === n ? e : t;
}
function Qs(e) {
  return ((e = hf(e)), e !== null ? Ks(e) : null);
}
function Ks(e) {
  if (e.tag === 5 || e.tag === 6) return e;
  for (e = e.child; e !== null; ) {
    var t = Ks(e);
    if (t !== null) return t;
    e = e.sibling;
  }
  return null;
}
var Xs = _e.unstable_scheduleCallback,
  ho = _e.unstable_cancelCallback,
  mf = _e.unstable_shouldYield,
  vf = _e.unstable_requestPaint,
  q = _e.unstable_now,
  gf = _e.unstable_getCurrentPriorityLevel,
  hu = _e.unstable_ImmediatePriority,
  Ys = _e.unstable_UserBlockingPriority,
  Jr = _e.unstable_NormalPriority,
  yf = _e.unstable_LowPriority,
  Gs = _e.unstable_IdlePriority,
  wl = null,
  Ye = null;
function wf(e) {
  if (Ye && typeof Ye.onCommitFiberRoot == "function")
    try {
      Ye.onCommitFiberRoot(wl, e, void 0, (e.current.flags & 128) === 128);
    } catch {}
}
var Ae = Math.clz32 ? Math.clz32 : xf,
  kf = Math.log,
  Sf = Math.LN2;
function xf(e) {
  return ((e >>>= 0), e === 0 ? 32 : (31 - ((kf(e) / Sf) | 0)) | 0);
}
var xr = 64,
  Er = 4194304;
function Dn(e) {
  switch (e & -e) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return e & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return e & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return e;
  }
}
function qr(e, t) {
  var n = e.pendingLanes;
  if (n === 0) return 0;
  var r = 0,
    l = e.suspendedLanes,
    i = e.pingedLanes,
    u = n & 268435455;
  if (u !== 0) {
    var o = u & ~l;
    o !== 0 ? (r = Dn(o)) : ((i &= u), i !== 0 && (r = Dn(i)));
  } else ((u = n & ~l), u !== 0 ? (r = Dn(u)) : i !== 0 && (r = Dn(i)));
  if (r === 0) return 0;
  if (
    t !== 0 &&
    t !== r &&
    !(t & l) &&
    ((l = r & -r), (i = t & -t), l >= i || (l === 16 && (i & 4194240) !== 0))
  )
    return t;
  if ((r & 4 && (r |= n & 16), (t = e.entangledLanes), t !== 0))
    for (e = e.entanglements, t &= r; 0 < t; )
      ((n = 31 - Ae(t)), (l = 1 << n), (r |= e[n]), (t &= ~l));
  return r;
}
function Ef(e, t) {
  switch (e) {
    case 1:
    case 2:
    case 4:
      return t + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return t + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function Cf(e, t) {
  for (
    var n = e.suspendedLanes,
      r = e.pingedLanes,
      l = e.expirationTimes,
      i = e.pendingLanes;
    0 < i;
  ) {
    var u = 31 - Ae(i),
      o = 1 << u,
      s = l[u];
    (s === -1
      ? (!(o & n) || o & r) && (l[u] = Ef(o, t))
      : s <= t && (e.expiredLanes |= o),
      (i &= ~o));
  }
}
function _i(e) {
  return (
    (e = e.pendingLanes & -1073741825),
    e !== 0 ? e : e & 1073741824 ? 1073741824 : 0
  );
}
function Zs() {
  var e = xr;
  return ((xr <<= 1), !(xr & 4194240) && (xr = 64), e);
}
function Vl(e) {
  for (var t = [], n = 0; 31 > n; n++) t.push(e);
  return t;
}
function fr(e, t, n) {
  ((e.pendingLanes |= t),
    t !== 536870912 && ((e.suspendedLanes = 0), (e.pingedLanes = 0)),
    (e = e.eventTimes),
    (t = 31 - Ae(t)),
    (e[t] = n));
}
function Nf(e, t) {
  var n = e.pendingLanes & ~t;
  ((e.pendingLanes = t),
    (e.suspendedLanes = 0),
    (e.pingedLanes = 0),
    (e.expiredLanes &= t),
    (e.mutableReadLanes &= t),
    (e.entangledLanes &= t),
    (t = e.entanglements));
  var r = e.eventTimes;
  for (e = e.expirationTimes; 0 < n; ) {
    var l = 31 - Ae(n),
      i = 1 << l;
    ((t[l] = 0), (r[l] = -1), (e[l] = -1), (n &= ~i));
  }
}
function mu(e, t) {
  var n = (e.entangledLanes |= t);
  for (e = e.entanglements; n; ) {
    var r = 31 - Ae(n),
      l = 1 << r;
    ((l & t) | (e[r] & t) && (e[r] |= t), (n &= ~l));
  }
}
var U = 0;
function Js(e) {
  return (
    (e &= -e),
    1 < e ? (4 < e ? (e & 268435455 ? 16 : 536870912) : 4) : 1
  );
}
var qs,
  vu,
  bs,
  ea,
  ta,
  Pi = !1,
  Cr = [],
  yt = null,
  wt = null,
  kt = null,
  Zn = new Map(),
  Jn = new Map(),
  ht = [],
  _f =
    "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(
      " ",
    );
function mo(e, t) {
  switch (e) {
    case "focusin":
    case "focusout":
      yt = null;
      break;
    case "dragenter":
    case "dragleave":
      wt = null;
      break;
    case "mouseover":
    case "mouseout":
      kt = null;
      break;
    case "pointerover":
    case "pointerout":
      Zn.delete(t.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Jn.delete(t.pointerId);
  }
}
function zn(e, t, n, r, l, i) {
  return e === null || e.nativeEvent !== i
    ? ((e = {
        blockedOn: t,
        domEventName: n,
        eventSystemFlags: r,
        nativeEvent: i,
        targetContainers: [l],
      }),
      t !== null && ((t = pr(t)), t !== null && vu(t)),
      e)
    : ((e.eventSystemFlags |= r),
      (t = e.targetContainers),
      l !== null && t.indexOf(l) === -1 && t.push(l),
      e);
}
function Pf(e, t, n, r, l) {
  switch (t) {
    case "focusin":
      return ((yt = zn(yt, e, t, n, r, l)), !0);
    case "dragenter":
      return ((wt = zn(wt, e, t, n, r, l)), !0);
    case "mouseover":
      return ((kt = zn(kt, e, t, n, r, l)), !0);
    case "pointerover":
      var i = l.pointerId;
      return (Zn.set(i, zn(Zn.get(i) || null, e, t, n, r, l)), !0);
    case "gotpointercapture":
      return (
        (i = l.pointerId),
        Jn.set(i, zn(Jn.get(i) || null, e, t, n, r, l)),
        !0
      );
  }
  return !1;
}
function na(e) {
  var t = Mt(e.target);
  if (t !== null) {
    var n = Qt(t);
    if (n !== null) {
      if (((t = n.tag), t === 13)) {
        if (((t = Ws(n)), t !== null)) {
          ((e.blockedOn = t),
            ta(e.priority, function () {
              bs(n);
            }));
          return;
        }
      } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
        e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
        return;
      }
    }
  }
  e.blockedOn = null;
}
function Fr(e) {
  if (e.blockedOn !== null) return !1;
  for (var t = e.targetContainers; 0 < t.length; ) {
    var n = zi(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
    if (n === null) {
      n = e.nativeEvent;
      var r = new n.constructor(n.type, n);
      ((xi = r), n.target.dispatchEvent(r), (xi = null));
    } else return ((t = pr(n)), t !== null && vu(t), (e.blockedOn = n), !1);
    t.shift();
  }
  return !0;
}
function vo(e, t, n) {
  Fr(e) && n.delete(t);
}
function zf() {
  ((Pi = !1),
    yt !== null && Fr(yt) && (yt = null),
    wt !== null && Fr(wt) && (wt = null),
    kt !== null && Fr(kt) && (kt = null),
    Zn.forEach(vo),
    Jn.forEach(vo));
}
function Tn(e, t) {
  e.blockedOn === t &&
    ((e.blockedOn = null),
    Pi ||
      ((Pi = !0),
      _e.unstable_scheduleCallback(_e.unstable_NormalPriority, zf)));
}
function qn(e) {
  function t(l) {
    return Tn(l, e);
  }
  if (0 < Cr.length) {
    Tn(Cr[0], e);
    for (var n = 1; n < Cr.length; n++) {
      var r = Cr[n];
      r.blockedOn === e && (r.blockedOn = null);
    }
  }
  for (
    yt !== null && Tn(yt, e),
      wt !== null && Tn(wt, e),
      kt !== null && Tn(kt, e),
      Zn.forEach(t),
      Jn.forEach(t),
      n = 0;
    n < ht.length;
    n++
  )
    ((r = ht[n]), r.blockedOn === e && (r.blockedOn = null));
  for (; 0 < ht.length && ((n = ht[0]), n.blockedOn === null); )
    (na(n), n.blockedOn === null && ht.shift());
}
var dn = st.ReactCurrentBatchConfig,
  br = !0;
function Tf(e, t, n, r) {
  var l = U,
    i = dn.transition;
  dn.transition = null;
  try {
    ((U = 1), gu(e, t, n, r));
  } finally {
    ((U = l), (dn.transition = i));
  }
}
function jf(e, t, n, r) {
  var l = U,
    i = dn.transition;
  dn.transition = null;
  try {
    ((U = 4), gu(e, t, n, r));
  } finally {
    ((U = l), (dn.transition = i));
  }
}
function gu(e, t, n, r) {
  if (br) {
    var l = zi(e, t, n, r);
    if (l === null) (Jl(e, t, r, el, n), mo(e, r));
    else if (Pf(l, e, t, n, r)) r.stopPropagation();
    else if ((mo(e, r), t & 4 && -1 < _f.indexOf(e))) {
      for (; l !== null; ) {
        var i = pr(l);
        if (
          (i !== null && qs(i),
          (i = zi(e, t, n, r)),
          i === null && Jl(e, t, r, el, n),
          i === l)
        )
          break;
        l = i;
      }
      l !== null && r.stopPropagation();
    } else Jl(e, t, r, null, n);
  }
}
var el = null;
function zi(e, t, n, r) {
  if (((el = null), (e = pu(r)), (e = Mt(e)), e !== null))
    if (((t = Qt(e)), t === null)) e = null;
    else if (((n = t.tag), n === 13)) {
      if (((e = Ws(t)), e !== null)) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated)
        return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
  return ((el = e), null);
}
function ra(e) {
  switch (e) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (gf()) {
        case hu:
          return 1;
        case Ys:
          return 4;
        case Jr:
        case yf:
          return 16;
        case Gs:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var vt = null,
  yu = null,
  $r = null;
function la() {
  if ($r) return $r;
  var e,
    t = yu,
    n = t.length,
    r,
    l = "value" in vt ? vt.value : vt.textContent,
    i = l.length;
  for (e = 0; e < n && t[e] === l[e]; e++);
  var u = n - e;
  for (r = 1; r <= u && t[n - r] === l[i - r]; r++);
  return ($r = l.slice(e, 1 < r ? 1 - r : void 0));
}
function Ur(e) {
  var t = e.keyCode;
  return (
    "charCode" in e
      ? ((e = e.charCode), e === 0 && t === 13 && (e = 13))
      : (e = t),
    e === 10 && (e = 13),
    32 <= e || e === 13 ? e : 0
  );
}
function Nr() {
  return !0;
}
function go() {
  return !1;
}
function ze(e) {
  function t(n, r, l, i, u) {
    ((this._reactName = n),
      (this._targetInst = l),
      (this.type = r),
      (this.nativeEvent = i),
      (this.target = u),
      (this.currentTarget = null));
    for (var o in e)
      e.hasOwnProperty(o) && ((n = e[o]), (this[o] = n ? n(i) : i[o]));
    return (
      (this.isDefaultPrevented = (
        i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1
      )
        ? Nr
        : go),
      (this.isPropagationStopped = go),
      this
    );
  }
  return (
    Z(t.prototype, {
      preventDefault: function () {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n &&
          (n.preventDefault
            ? n.preventDefault()
            : typeof n.returnValue != "unknown" && (n.returnValue = !1),
          (this.isDefaultPrevented = Nr));
      },
      stopPropagation: function () {
        var n = this.nativeEvent;
        n &&
          (n.stopPropagation
            ? n.stopPropagation()
            : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0),
          (this.isPropagationStopped = Nr));
      },
      persist: function () {},
      isPersistent: Nr,
    }),
    t
  );
}
var En = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function (e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0,
  },
  wu = ze(En),
  dr = Z({}, En, { view: 0, detail: 0 }),
  Lf = ze(dr),
  Bl,
  Hl,
  jn,
  kl = Z({}, dr, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: ku,
    button: 0,
    buttons: 0,
    relatedTarget: function (e) {
      return e.relatedTarget === void 0
        ? e.fromElement === e.srcElement
          ? e.toElement
          : e.fromElement
        : e.relatedTarget;
    },
    movementX: function (e) {
      return "movementX" in e
        ? e.movementX
        : (e !== jn &&
            (jn && e.type === "mousemove"
              ? ((Bl = e.screenX - jn.screenX), (Hl = e.screenY - jn.screenY))
              : (Hl = Bl = 0),
            (jn = e)),
          Bl);
    },
    movementY: function (e) {
      return "movementY" in e ? e.movementY : Hl;
    },
  }),
  yo = ze(kl),
  Rf = Z({}, kl, { dataTransfer: 0 }),
  Mf = ze(Rf),
  Of = Z({}, dr, { relatedTarget: 0 }),
  Wl = ze(Of),
  If = Z({}, En, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
  Df = ze(If),
  Ff = Z({}, En, {
    clipboardData: function (e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    },
  }),
  $f = ze(Ff),
  Uf = Z({}, En, { data: 0 }),
  wo = ze(Uf),
  Af = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified",
  },
  Vf = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta",
  },
  Bf = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey",
  };
function Hf(e) {
  var t = this.nativeEvent;
  return t.getModifierState ? t.getModifierState(e) : (e = Bf[e]) ? !!t[e] : !1;
}
function ku() {
  return Hf;
}
var Wf = Z({}, dr, {
    key: function (e) {
      if (e.key) {
        var t = Af[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress"
        ? ((e = Ur(e)), e === 13 ? "Enter" : String.fromCharCode(e))
        : e.type === "keydown" || e.type === "keyup"
          ? Vf[e.keyCode] || "Unidentified"
          : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: ku,
    charCode: function (e) {
      return e.type === "keypress" ? Ur(e) : 0;
    },
    keyCode: function (e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function (e) {
      return e.type === "keypress"
        ? Ur(e)
        : e.type === "keydown" || e.type === "keyup"
          ? e.keyCode
          : 0;
    },
  }),
  Qf = ze(Wf),
  Kf = Z({}, kl, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0,
  }),
  ko = ze(Kf),
  Xf = Z({}, dr, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: ku,
  }),
  Yf = ze(Xf),
  Gf = Z({}, En, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
  Zf = ze(Gf),
  Jf = Z({}, kl, {
    deltaX: function (e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function (e) {
      return "deltaY" in e
        ? e.deltaY
        : "wheelDeltaY" in e
          ? -e.wheelDeltaY
          : "wheelDelta" in e
            ? -e.wheelDelta
            : 0;
    },
    deltaZ: 0,
    deltaMode: 0,
  }),
  qf = ze(Jf),
  bf = [9, 13, 27, 32],
  Su = lt && "CompositionEvent" in window,
  An = null;
lt && "documentMode" in document && (An = document.documentMode);
var ed = lt && "TextEvent" in window && !An,
  ia = lt && (!Su || (An && 8 < An && 11 >= An)),
  So = " ",
  xo = !1;
function ua(e, t) {
  switch (e) {
    case "keyup":
      return bf.indexOf(t.keyCode) !== -1;
    case "keydown":
      return t.keyCode !== 229;
    case "keypress":
    case "mousedown":
    case "focusout":
      return !0;
    default:
      return !1;
  }
}
function oa(e) {
  return ((e = e.detail), typeof e == "object" && "data" in e ? e.data : null);
}
var Jt = !1;
function td(e, t) {
  switch (e) {
    case "compositionend":
      return oa(t);
    case "keypress":
      return t.which !== 32 ? null : ((xo = !0), So);
    case "textInput":
      return ((e = t.data), e === So && xo ? null : e);
    default:
      return null;
  }
}
function nd(e, t) {
  if (Jt)
    return e === "compositionend" || (!Su && ua(e, t))
      ? ((e = la()), ($r = yu = vt = null), (Jt = !1), e)
      : null;
  switch (e) {
    case "paste":
      return null;
    case "keypress":
      if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
        if (t.char && 1 < t.char.length) return t.char;
        if (t.which) return String.fromCharCode(t.which);
      }
      return null;
    case "compositionend":
      return ia && t.locale !== "ko" ? null : t.data;
    default:
      return null;
  }
}
var rd = {
  color: !0,
  date: !0,
  datetime: !0,
  "datetime-local": !0,
  email: !0,
  month: !0,
  number: !0,
  password: !0,
  range: !0,
  search: !0,
  tel: !0,
  text: !0,
  time: !0,
  url: !0,
  week: !0,
};
function Eo(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t === "input" ? !!rd[e.type] : t === "textarea";
}
function sa(e, t, n, r) {
  (Us(r),
    (t = tl(t, "onChange")),
    0 < t.length &&
      ((n = new wu("onChange", "change", null, n, r)),
      e.push({ event: n, listeners: t })));
}
var Vn = null,
  bn = null;
function ld(e) {
  wa(e, 0);
}
function Sl(e) {
  var t = en(e);
  if (Rs(t)) return e;
}
function id(e, t) {
  if (e === "change") return t;
}
var aa = !1;
if (lt) {
  var Ql;
  if (lt) {
    var Kl = "oninput" in document;
    if (!Kl) {
      var Co = document.createElement("div");
      (Co.setAttribute("oninput", "return;"),
        (Kl = typeof Co.oninput == "function"));
    }
    Ql = Kl;
  } else Ql = !1;
  aa = Ql && (!document.documentMode || 9 < document.documentMode);
}
function No() {
  Vn && (Vn.detachEvent("onpropertychange", ca), (bn = Vn = null));
}
function ca(e) {
  if (e.propertyName === "value" && Sl(bn)) {
    var t = [];
    (sa(t, bn, e, pu(e)), Hs(ld, t));
  }
}
function ud(e, t, n) {
  e === "focusin"
    ? (No(), (Vn = t), (bn = n), Vn.attachEvent("onpropertychange", ca))
    : e === "focusout" && No();
}
function od(e) {
  if (e === "selectionchange" || e === "keyup" || e === "keydown")
    return Sl(bn);
}
function sd(e, t) {
  if (e === "click") return Sl(t);
}
function ad(e, t) {
  if (e === "input" || e === "change") return Sl(t);
}
function cd(e, t) {
  return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
}
var Be = typeof Object.is == "function" ? Object.is : cd;
function er(e, t) {
  if (Be(e, t)) return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null)
    return !1;
  var n = Object.keys(e),
    r = Object.keys(t);
  if (n.length !== r.length) return !1;
  for (r = 0; r < n.length; r++) {
    var l = n[r];
    if (!ci.call(t, l) || !Be(e[l], t[l])) return !1;
  }
  return !0;
}
function _o(e) {
  for (; e && e.firstChild; ) e = e.firstChild;
  return e;
}
function Po(e, t) {
  var n = _o(e);
  e = 0;
  for (var r; n; ) {
    if (n.nodeType === 3) {
      if (((r = e + n.textContent.length), e <= t && r >= t))
        return { node: n, offset: t - e };
      e = r;
    }
    e: {
      for (; n; ) {
        if (n.nextSibling) {
          n = n.nextSibling;
          break e;
        }
        n = n.parentNode;
      }
      n = void 0;
    }
    n = _o(n);
  }
}
function fa(e, t) {
  return e && t
    ? e === t
      ? !0
      : e && e.nodeType === 3
        ? !1
        : t && t.nodeType === 3
          ? fa(e, t.parentNode)
          : "contains" in e
            ? e.contains(t)
            : e.compareDocumentPosition
              ? !!(e.compareDocumentPosition(t) & 16)
              : !1
    : !1;
}
function da() {
  for (var e = window, t = Yr(); t instanceof e.HTMLIFrameElement; ) {
    try {
      var n = typeof t.contentWindow.location.href == "string";
    } catch {
      n = !1;
    }
    if (n) e = t.contentWindow;
    else break;
    t = Yr(e.document);
  }
  return t;
}
function xu(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return (
    t &&
    ((t === "input" &&
      (e.type === "text" ||
        e.type === "search" ||
        e.type === "tel" ||
        e.type === "url" ||
        e.type === "password")) ||
      t === "textarea" ||
      e.contentEditable === "true")
  );
}
function fd(e) {
  var t = da(),
    n = e.focusedElem,
    r = e.selectionRange;
  if (
    t !== n &&
    n &&
    n.ownerDocument &&
    fa(n.ownerDocument.documentElement, n)
  ) {
    if (r !== null && xu(n)) {
      if (
        ((t = r.start),
        (e = r.end),
        e === void 0 && (e = t),
        "selectionStart" in n)
      )
        ((n.selectionStart = t),
          (n.selectionEnd = Math.min(e, n.value.length)));
      else if (
        ((e = ((t = n.ownerDocument || document) && t.defaultView) || window),
        e.getSelection)
      ) {
        e = e.getSelection();
        var l = n.textContent.length,
          i = Math.min(r.start, l);
        ((r = r.end === void 0 ? i : Math.min(r.end, l)),
          !e.extend && i > r && ((l = r), (r = i), (i = l)),
          (l = Po(n, i)));
        var u = Po(n, r);
        l &&
          u &&
          (e.rangeCount !== 1 ||
            e.anchorNode !== l.node ||
            e.anchorOffset !== l.offset ||
            e.focusNode !== u.node ||
            e.focusOffset !== u.offset) &&
          ((t = t.createRange()),
          t.setStart(l.node, l.offset),
          e.removeAllRanges(),
          i > r
            ? (e.addRange(t), e.extend(u.node, u.offset))
            : (t.setEnd(u.node, u.offset), e.addRange(t)));
      }
    }
    for (t = [], e = n; (e = e.parentNode); )
      e.nodeType === 1 &&
        t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
    for (typeof n.focus == "function" && n.focus(), n = 0; n < t.length; n++)
      ((e = t[n]),
        (e.element.scrollLeft = e.left),
        (e.element.scrollTop = e.top));
  }
}
var dd = lt && "documentMode" in document && 11 >= document.documentMode,
  qt = null,
  Ti = null,
  Bn = null,
  ji = !1;
function zo(e, t, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
  ji ||
    qt == null ||
    qt !== Yr(r) ||
    ((r = qt),
    "selectionStart" in r && xu(r)
      ? (r = { start: r.selectionStart, end: r.selectionEnd })
      : ((r = (
          (r.ownerDocument && r.ownerDocument.defaultView) ||
          window
        ).getSelection()),
        (r = {
          anchorNode: r.anchorNode,
          anchorOffset: r.anchorOffset,
          focusNode: r.focusNode,
          focusOffset: r.focusOffset,
        })),
    (Bn && er(Bn, r)) ||
      ((Bn = r),
      (r = tl(Ti, "onSelect")),
      0 < r.length &&
        ((t = new wu("onSelect", "select", null, t, n)),
        e.push({ event: t, listeners: r }),
        (t.target = qt))));
}
function _r(e, t) {
  var n = {};
  return (
    (n[e.toLowerCase()] = t.toLowerCase()),
    (n["Webkit" + e] = "webkit" + t),
    (n["Moz" + e] = "moz" + t),
    n
  );
}
var bt = {
    animationend: _r("Animation", "AnimationEnd"),
    animationiteration: _r("Animation", "AnimationIteration"),
    animationstart: _r("Animation", "AnimationStart"),
    transitionend: _r("Transition", "TransitionEnd"),
  },
  Xl = {},
  pa = {};
lt &&
  ((pa = document.createElement("div").style),
  "AnimationEvent" in window ||
    (delete bt.animationend.animation,
    delete bt.animationiteration.animation,
    delete bt.animationstart.animation),
  "TransitionEvent" in window || delete bt.transitionend.transition);
function xl(e) {
  if (Xl[e]) return Xl[e];
  if (!bt[e]) return e;
  var t = bt[e],
    n;
  for (n in t) if (t.hasOwnProperty(n) && n in pa) return (Xl[e] = t[n]);
  return e;
}
var ha = xl("animationend"),
  ma = xl("animationiteration"),
  va = xl("animationstart"),
  ga = xl("transitionend"),
  ya = new Map(),
  To =
    "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
      " ",
    );
function zt(e, t) {
  (ya.set(e, t), Wt(t, [e]));
}
for (var Yl = 0; Yl < To.length; Yl++) {
  var Gl = To[Yl],
    pd = Gl.toLowerCase(),
    hd = Gl[0].toUpperCase() + Gl.slice(1);
  zt(pd, "on" + hd);
}
zt(ha, "onAnimationEnd");
zt(ma, "onAnimationIteration");
zt(va, "onAnimationStart");
zt("dblclick", "onDoubleClick");
zt("focusin", "onFocus");
zt("focusout", "onBlur");
zt(ga, "onTransitionEnd");
mn("onMouseEnter", ["mouseout", "mouseover"]);
mn("onMouseLeave", ["mouseout", "mouseover"]);
mn("onPointerEnter", ["pointerout", "pointerover"]);
mn("onPointerLeave", ["pointerout", "pointerover"]);
Wt(
  "onChange",
  "change click focusin focusout input keydown keyup selectionchange".split(
    " ",
  ),
);
Wt(
  "onSelect",
  "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
    " ",
  ),
);
Wt("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
Wt(
  "onCompositionEnd",
  "compositionend focusout keydown keypress keyup mousedown".split(" "),
);
Wt(
  "onCompositionStart",
  "compositionstart focusout keydown keypress keyup mousedown".split(" "),
);
Wt(
  "onCompositionUpdate",
  "compositionupdate focusout keydown keypress keyup mousedown".split(" "),
);
var Fn =
    "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
      " ",
    ),
  md = new Set("cancel close invalid load scroll toggle".split(" ").concat(Fn));
function jo(e, t, n) {
  var r = e.type || "unknown-event";
  ((e.currentTarget = n), pf(r, t, void 0, e), (e.currentTarget = null));
}
function wa(e, t) {
  t = (t & 4) !== 0;
  for (var n = 0; n < e.length; n++) {
    var r = e[n],
      l = r.event;
    r = r.listeners;
    e: {
      var i = void 0;
      if (t)
        for (var u = r.length - 1; 0 <= u; u--) {
          var o = r[u],
            s = o.instance,
            c = o.currentTarget;
          if (((o = o.listener), s !== i && l.isPropagationStopped())) break e;
          (jo(l, o, c), (i = s));
        }
      else
        for (u = 0; u < r.length; u++) {
          if (
            ((o = r[u]),
            (s = o.instance),
            (c = o.currentTarget),
            (o = o.listener),
            s !== i && l.isPropagationStopped())
          )
            break e;
          (jo(l, o, c), (i = s));
        }
    }
  }
  if (Zr) throw ((e = Ni), (Zr = !1), (Ni = null), e);
}
function H(e, t) {
  var n = t[Ii];
  n === void 0 && (n = t[Ii] = new Set());
  var r = e + "__bubble";
  n.has(r) || (ka(t, e, 2, !1), n.add(r));
}
function Zl(e, t, n) {
  var r = 0;
  (t && (r |= 4), ka(n, e, r, t));
}
var Pr = "_reactListening" + Math.random().toString(36).slice(2);
function tr(e) {
  if (!e[Pr]) {
    ((e[Pr] = !0),
      Ps.forEach(function (n) {
        n !== "selectionchange" && (md.has(n) || Zl(n, !1, e), Zl(n, !0, e));
      }));
    var t = e.nodeType === 9 ? e : e.ownerDocument;
    t === null || t[Pr] || ((t[Pr] = !0), Zl("selectionchange", !1, t));
  }
}
function ka(e, t, n, r) {
  switch (ra(t)) {
    case 1:
      var l = Tf;
      break;
    case 4:
      l = jf;
      break;
    default:
      l = gu;
  }
  ((n = l.bind(null, t, n, e)),
    (l = void 0),
    !Ci ||
      (t !== "touchstart" && t !== "touchmove" && t !== "wheel") ||
      (l = !0),
    r
      ? l !== void 0
        ? e.addEventListener(t, n, { capture: !0, passive: l })
        : e.addEventListener(t, n, !0)
      : l !== void 0
        ? e.addEventListener(t, n, { passive: l })
        : e.addEventListener(t, n, !1));
}
function Jl(e, t, n, r, l) {
  var i = r;
  if (!(t & 1) && !(t & 2) && r !== null)
    e: for (;;) {
      if (r === null) return;
      var u = r.tag;
      if (u === 3 || u === 4) {
        var o = r.stateNode.containerInfo;
        if (o === l || (o.nodeType === 8 && o.parentNode === l)) break;
        if (u === 4)
          for (u = r.return; u !== null; ) {
            var s = u.tag;
            if (
              (s === 3 || s === 4) &&
              ((s = u.stateNode.containerInfo),
              s === l || (s.nodeType === 8 && s.parentNode === l))
            )
              return;
            u = u.return;
          }
        for (; o !== null; ) {
          if (((u = Mt(o)), u === null)) return;
          if (((s = u.tag), s === 5 || s === 6)) {
            r = i = u;
            continue e;
          }
          o = o.parentNode;
        }
      }
      r = r.return;
    }
  Hs(function () {
    var c = i,
      m = pu(n),
      h = [];
    e: {
      var p = ya.get(e);
      if (p !== void 0) {
        var k = wu,
          S = e;
        switch (e) {
          case "keypress":
            if (Ur(n) === 0) break e;
          case "keydown":
          case "keyup":
            k = Qf;
            break;
          case "focusin":
            ((S = "focus"), (k = Wl));
            break;
          case "focusout":
            ((S = "blur"), (k = Wl));
            break;
          case "beforeblur":
          case "afterblur":
            k = Wl;
            break;
          case "click":
            if (n.button === 2) break e;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            k = yo;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            k = Mf;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            k = Yf;
            break;
          case ha:
          case ma:
          case va:
            k = Df;
            break;
          case ga:
            k = Zf;
            break;
          case "scroll":
            k = Lf;
            break;
          case "wheel":
            k = qf;
            break;
          case "copy":
          case "cut":
          case "paste":
            k = $f;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            k = ko;
        }
        var x = (t & 4) !== 0,
          L = !x && e === "scroll",
          f = x ? (p !== null ? p + "Capture" : null) : p;
        x = [];
        for (var a = c, d; a !== null; ) {
          d = a;
          var v = d.stateNode;
          if (
            (d.tag === 5 &&
              v !== null &&
              ((d = v),
              f !== null && ((v = Gn(a, f)), v != null && x.push(nr(a, v, d)))),
            L)
          )
            break;
          a = a.return;
        }
        0 < x.length &&
          ((p = new k(p, S, null, n, m)), h.push({ event: p, listeners: x }));
      }
    }
    if (!(t & 7)) {
      e: {
        if (
          ((p = e === "mouseover" || e === "pointerover"),
          (k = e === "mouseout" || e === "pointerout"),
          p &&
            n !== xi &&
            (S = n.relatedTarget || n.fromElement) &&
            (Mt(S) || S[it]))
        )
          break e;
        if (
          (k || p) &&
          ((p =
            m.window === m
              ? m
              : (p = m.ownerDocument)
                ? p.defaultView || p.parentWindow
                : window),
          k
            ? ((S = n.relatedTarget || n.toElement),
              (k = c),
              (S = S ? Mt(S) : null),
              S !== null &&
                ((L = Qt(S)), S !== L || (S.tag !== 5 && S.tag !== 6)) &&
                (S = null))
            : ((k = null), (S = c)),
          k !== S)
        ) {
          if (
            ((x = yo),
            (v = "onMouseLeave"),
            (f = "onMouseEnter"),
            (a = "mouse"),
            (e === "pointerout" || e === "pointerover") &&
              ((x = ko),
              (v = "onPointerLeave"),
              (f = "onPointerEnter"),
              (a = "pointer")),
            (L = k == null ? p : en(k)),
            (d = S == null ? p : en(S)),
            (p = new x(v, a + "leave", k, n, m)),
            (p.target = L),
            (p.relatedTarget = d),
            (v = null),
            Mt(m) === c &&
              ((x = new x(f, a + "enter", S, n, m)),
              (x.target = d),
              (x.relatedTarget = L),
              (v = x)),
            (L = v),
            k && S)
          )
            t: {
              for (x = k, f = S, a = 0, d = x; d; d = Yt(d)) a++;
              for (d = 0, v = f; v; v = Yt(v)) d++;
              for (; 0 < a - d; ) ((x = Yt(x)), a--);
              for (; 0 < d - a; ) ((f = Yt(f)), d--);
              for (; a--; ) {
                if (x === f || (f !== null && x === f.alternate)) break t;
                ((x = Yt(x)), (f = Yt(f)));
              }
              x = null;
            }
          else x = null;
          (k !== null && Lo(h, p, k, x, !1),
            S !== null && L !== null && Lo(h, L, S, x, !0));
        }
      }
      e: {
        if (
          ((p = c ? en(c) : window),
          (k = p.nodeName && p.nodeName.toLowerCase()),
          k === "select" || (k === "input" && p.type === "file"))
        )
          var E = id;
        else if (Eo(p))
          if (aa) E = ad;
          else {
            E = od;
            var _ = ud;
          }
        else
          (k = p.nodeName) &&
            k.toLowerCase() === "input" &&
            (p.type === "checkbox" || p.type === "radio") &&
            (E = sd);
        if (E && (E = E(e, c))) {
          sa(h, E, n, m);
          break e;
        }
        (_ && _(e, p, c),
          e === "focusout" &&
            (_ = p._wrapperState) &&
            _.controlled &&
            p.type === "number" &&
            gi(p, "number", p.value));
      }
      switch (((_ = c ? en(c) : window), e)) {
        case "focusin":
          (Eo(_) || _.contentEditable === "true") &&
            ((qt = _), (Ti = c), (Bn = null));
          break;
        case "focusout":
          Bn = Ti = qt = null;
          break;
        case "mousedown":
          ji = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          ((ji = !1), zo(h, n, m));
          break;
        case "selectionchange":
          if (dd) break;
        case "keydown":
        case "keyup":
          zo(h, n, m);
      }
      var w;
      if (Su)
        e: {
          switch (e) {
            case "compositionstart":
              var P = "onCompositionStart";
              break e;
            case "compositionend":
              P = "onCompositionEnd";
              break e;
            case "compositionupdate":
              P = "onCompositionUpdate";
              break e;
          }
          P = void 0;
        }
      else
        Jt
          ? ua(e, n) && (P = "onCompositionEnd")
          : e === "keydown" && n.keyCode === 229 && (P = "onCompositionStart");
      (P &&
        (ia &&
          n.locale !== "ko" &&
          (Jt || P !== "onCompositionStart"
            ? P === "onCompositionEnd" && Jt && (w = la())
            : ((vt = m),
              (yu = "value" in vt ? vt.value : vt.textContent),
              (Jt = !0))),
        (_ = tl(c, P)),
        0 < _.length &&
          ((P = new wo(P, e, null, n, m)),
          h.push({ event: P, listeners: _ }),
          w ? (P.data = w) : ((w = oa(n)), w !== null && (P.data = w)))),
        (w = ed ? td(e, n) : nd(e, n)) &&
          ((c = tl(c, "onBeforeInput")),
          0 < c.length &&
            ((m = new wo("onBeforeInput", "beforeinput", null, n, m)),
            h.push({ event: m, listeners: c }),
            (m.data = w))));
    }
    wa(h, t);
  });
}
function nr(e, t, n) {
  return { instance: e, listener: t, currentTarget: n };
}
function tl(e, t) {
  for (var n = t + "Capture", r = []; e !== null; ) {
    var l = e,
      i = l.stateNode;
    (l.tag === 5 &&
      i !== null &&
      ((l = i),
      (i = Gn(e, n)),
      i != null && r.unshift(nr(e, i, l)),
      (i = Gn(e, t)),
      i != null && r.push(nr(e, i, l))),
      (e = e.return));
  }
  return r;
}
function Yt(e) {
  if (e === null) return null;
  do e = e.return;
  while (e && e.tag !== 5);
  return e || null;
}
function Lo(e, t, n, r, l) {
  for (var i = t._reactName, u = []; n !== null && n !== r; ) {
    var o = n,
      s = o.alternate,
      c = o.stateNode;
    if (s !== null && s === r) break;
    (o.tag === 5 &&
      c !== null &&
      ((o = c),
      l
        ? ((s = Gn(n, i)), s != null && u.unshift(nr(n, s, o)))
        : l || ((s = Gn(n, i)), s != null && u.push(nr(n, s, o)))),
      (n = n.return));
  }
  u.length !== 0 && e.push({ event: t, listeners: u });
}
var vd = /\r\n?/g,
  gd = /\u0000|\uFFFD/g;
function Ro(e) {
  return (typeof e == "string" ? e : "" + e)
    .replace(
      vd,
      `
`,
    )
    .replace(gd, "");
}
function zr(e, t, n) {
  if (((t = Ro(t)), Ro(e) !== t && n)) throw Error(y(425));
}
function nl() {}
var Li = null,
  Ri = null;
function Mi(e, t) {
  return (
    e === "textarea" ||
    e === "noscript" ||
    typeof t.children == "string" ||
    typeof t.children == "number" ||
    (typeof t.dangerouslySetInnerHTML == "object" &&
      t.dangerouslySetInnerHTML !== null &&
      t.dangerouslySetInnerHTML.__html != null)
  );
}
var Oi = typeof setTimeout == "function" ? setTimeout : void 0,
  yd = typeof clearTimeout == "function" ? clearTimeout : void 0,
  Mo = typeof Promise == "function" ? Promise : void 0,
  wd =
    typeof queueMicrotask == "function"
      ? queueMicrotask
      : typeof Mo < "u"
        ? function (e) {
            return Mo.resolve(null).then(e).catch(kd);
          }
        : Oi;
function kd(e) {
  setTimeout(function () {
    throw e;
  });
}
function ql(e, t) {
  var n = t,
    r = 0;
  do {
    var l = n.nextSibling;
    if ((e.removeChild(n), l && l.nodeType === 8))
      if (((n = l.data), n === "/$")) {
        if (r === 0) {
          (e.removeChild(l), qn(t));
          return;
        }
        r--;
      } else (n !== "$" && n !== "$?" && n !== "$!") || r++;
    n = l;
  } while (n);
  qn(t);
}
function St(e) {
  for (; e != null; e = e.nextSibling) {
    var t = e.nodeType;
    if (t === 1 || t === 3) break;
    if (t === 8) {
      if (((t = e.data), t === "$" || t === "$!" || t === "$?")) break;
      if (t === "/$") return null;
    }
  }
  return e;
}
function Oo(e) {
  e = e.previousSibling;
  for (var t = 0; e; ) {
    if (e.nodeType === 8) {
      var n = e.data;
      if (n === "$" || n === "$!" || n === "$?") {
        if (t === 0) return e;
        t--;
      } else n === "/$" && t++;
    }
    e = e.previousSibling;
  }
  return null;
}
var Cn = Math.random().toString(36).slice(2),
  Xe = "__reactFiber$" + Cn,
  rr = "__reactProps$" + Cn,
  it = "__reactContainer$" + Cn,
  Ii = "__reactEvents$" + Cn,
  Sd = "__reactListeners$" + Cn,
  xd = "__reactHandles$" + Cn;
function Mt(e) {
  var t = e[Xe];
  if (t) return t;
  for (var n = e.parentNode; n; ) {
    if ((t = n[it] || n[Xe])) {
      if (
        ((n = t.alternate),
        t.child !== null || (n !== null && n.child !== null))
      )
        for (e = Oo(e); e !== null; ) {
          if ((n = e[Xe])) return n;
          e = Oo(e);
        }
      return t;
    }
    ((e = n), (n = e.parentNode));
  }
  return null;
}
function pr(e) {
  return (
    (e = e[Xe] || e[it]),
    !e || (e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3) ? null : e
  );
}
function en(e) {
  if (e.tag === 5 || e.tag === 6) return e.stateNode;
  throw Error(y(33));
}
function El(e) {
  return e[rr] || null;
}
var Di = [],
  tn = -1;
function Tt(e) {
  return { current: e };
}
function W(e) {
  0 > tn || ((e.current = Di[tn]), (Di[tn] = null), tn--);
}
function A(e, t) {
  (tn++, (Di[tn] = e.current), (e.current = t));
}
var Pt = {},
  fe = Tt(Pt),
  ye = Tt(!1),
  Ut = Pt;
function vn(e, t) {
  var n = e.type.contextTypes;
  if (!n) return Pt;
  var r = e.stateNode;
  if (r && r.__reactInternalMemoizedUnmaskedChildContext === t)
    return r.__reactInternalMemoizedMaskedChildContext;
  var l = {},
    i;
  for (i in n) l[i] = t[i];
  return (
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = t),
      (e.__reactInternalMemoizedMaskedChildContext = l)),
    l
  );
}
function we(e) {
  return ((e = e.childContextTypes), e != null);
}
function rl() {
  (W(ye), W(fe));
}
function Io(e, t, n) {
  if (fe.current !== Pt) throw Error(y(168));
  (A(fe, t), A(ye, n));
}
function Sa(e, t, n) {
  var r = e.stateNode;
  if (((t = t.childContextTypes), typeof r.getChildContext != "function"))
    return n;
  r = r.getChildContext();
  for (var l in r) if (!(l in t)) throw Error(y(108, uf(e) || "Unknown", l));
  return Z({}, n, r);
}
function ll(e) {
  return (
    (e =
      ((e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext) || Pt),
    (Ut = fe.current),
    A(fe, e),
    A(ye, ye.current),
    !0
  );
}
function Do(e, t, n) {
  var r = e.stateNode;
  if (!r) throw Error(y(169));
  (n
    ? ((e = Sa(e, t, Ut)),
      (r.__reactInternalMemoizedMergedChildContext = e),
      W(ye),
      W(fe),
      A(fe, e))
    : W(ye),
    A(ye, n));
}
var et = null,
  Cl = !1,
  bl = !1;
function xa(e) {
  et === null ? (et = [e]) : et.push(e);
}
function Ed(e) {
  ((Cl = !0), xa(e));
}
function jt() {
  if (!bl && et !== null) {
    bl = !0;
    var e = 0,
      t = U;
    try {
      var n = et;
      for (U = 1; e < n.length; e++) {
        var r = n[e];
        do r = r(!0);
        while (r !== null);
      }
      ((et = null), (Cl = !1));
    } catch (l) {
      throw (et !== null && (et = et.slice(e + 1)), Xs(hu, jt), l);
    } finally {
      ((U = t), (bl = !1));
    }
  }
  return null;
}
var nn = [],
  rn = 0,
  il = null,
  ul = 0,
  je = [],
  Le = 0,
  At = null,
  tt = 1,
  nt = "";
function Lt(e, t) {
  ((nn[rn++] = ul), (nn[rn++] = il), (il = e), (ul = t));
}
function Ea(e, t, n) {
  ((je[Le++] = tt), (je[Le++] = nt), (je[Le++] = At), (At = e));
  var r = tt;
  e = nt;
  var l = 32 - Ae(r) - 1;
  ((r &= ~(1 << l)), (n += 1));
  var i = 32 - Ae(t) + l;
  if (30 < i) {
    var u = l - (l % 5);
    ((i = (r & ((1 << u) - 1)).toString(32)),
      (r >>= u),
      (l -= u),
      (tt = (1 << (32 - Ae(t) + l)) | (n << l) | r),
      (nt = i + e));
  } else ((tt = (1 << i) | (n << l) | r), (nt = e));
}
function Eu(e) {
  e.return !== null && (Lt(e, 1), Ea(e, 1, 0));
}
function Cu(e) {
  for (; e === il; )
    ((il = nn[--rn]), (nn[rn] = null), (ul = nn[--rn]), (nn[rn] = null));
  for (; e === At; )
    ((At = je[--Le]),
      (je[Le] = null),
      (nt = je[--Le]),
      (je[Le] = null),
      (tt = je[--Le]),
      (je[Le] = null));
}
var Ne = null,
  Ce = null,
  K = !1,
  Ue = null;
function Ca(e, t) {
  var n = Re(5, null, null, 0);
  ((n.elementType = "DELETED"),
    (n.stateNode = t),
    (n.return = e),
    (t = e.deletions),
    t === null ? ((e.deletions = [n]), (e.flags |= 16)) : t.push(n));
}
function Fo(e, t) {
  switch (e.tag) {
    case 5:
      var n = e.type;
      return (
        (t =
          t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase()
            ? null
            : t),
        t !== null
          ? ((e.stateNode = t), (Ne = e), (Ce = St(t.firstChild)), !0)
          : !1
      );
    case 6:
      return (
        (t = e.pendingProps === "" || t.nodeType !== 3 ? null : t),
        t !== null ? ((e.stateNode = t), (Ne = e), (Ce = null), !0) : !1
      );
    case 13:
      return (
        (t = t.nodeType !== 8 ? null : t),
        t !== null
          ? ((n = At !== null ? { id: tt, overflow: nt } : null),
            (e.memoizedState = {
              dehydrated: t,
              treeContext: n,
              retryLane: 1073741824,
            }),
            (n = Re(18, null, null, 0)),
            (n.stateNode = t),
            (n.return = e),
            (e.child = n),
            (Ne = e),
            (Ce = null),
            !0)
          : !1
      );
    default:
      return !1;
  }
}
function Fi(e) {
  return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
}
function $i(e) {
  if (K) {
    var t = Ce;
    if (t) {
      var n = t;
      if (!Fo(e, t)) {
        if (Fi(e)) throw Error(y(418));
        t = St(n.nextSibling);
        var r = Ne;
        t && Fo(e, t)
          ? Ca(r, n)
          : ((e.flags = (e.flags & -4097) | 2), (K = !1), (Ne = e));
      }
    } else {
      if (Fi(e)) throw Error(y(418));
      ((e.flags = (e.flags & -4097) | 2), (K = !1), (Ne = e));
    }
  }
}
function $o(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; )
    e = e.return;
  Ne = e;
}
function Tr(e) {
  if (e !== Ne) return !1;
  if (!K) return ($o(e), (K = !0), !1);
  var t;
  if (
    ((t = e.tag !== 3) &&
      !(t = e.tag !== 5) &&
      ((t = e.type),
      (t = t !== "head" && t !== "body" && !Mi(e.type, e.memoizedProps))),
    t && (t = Ce))
  ) {
    if (Fi(e)) throw (Na(), Error(y(418)));
    for (; t; ) (Ca(e, t), (t = St(t.nextSibling)));
  }
  if (($o(e), e.tag === 13)) {
    if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
      throw Error(y(317));
    e: {
      for (e = e.nextSibling, t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === "/$") {
            if (t === 0) {
              Ce = St(e.nextSibling);
              break e;
            }
            t--;
          } else (n !== "$" && n !== "$!" && n !== "$?") || t++;
        }
        e = e.nextSibling;
      }
      Ce = null;
    }
  } else Ce = Ne ? St(e.stateNode.nextSibling) : null;
  return !0;
}
function Na() {
  for (var e = Ce; e; ) e = St(e.nextSibling);
}
function gn() {
  ((Ce = Ne = null), (K = !1));
}
function Nu(e) {
  Ue === null ? (Ue = [e]) : Ue.push(e);
}
var Cd = st.ReactCurrentBatchConfig;
function Ln(e, t, n) {
  if (
    ((e = n.ref), e !== null && typeof e != "function" && typeof e != "object")
  ) {
    if (n._owner) {
      if (((n = n._owner), n)) {
        if (n.tag !== 1) throw Error(y(309));
        var r = n.stateNode;
      }
      if (!r) throw Error(y(147, e));
      var l = r,
        i = "" + e;
      return t !== null &&
        t.ref !== null &&
        typeof t.ref == "function" &&
        t.ref._stringRef === i
        ? t.ref
        : ((t = function (u) {
            var o = l.refs;
            u === null ? delete o[i] : (o[i] = u);
          }),
          (t._stringRef = i),
          t);
    }
    if (typeof e != "string") throw Error(y(284));
    if (!n._owner) throw Error(y(290, e));
  }
  return e;
}
function jr(e, t) {
  throw (
    (e = Object.prototype.toString.call(t)),
    Error(
      y(
        31,
        e === "[object Object]"
          ? "object with keys {" + Object.keys(t).join(", ") + "}"
          : e,
      ),
    )
  );
}
function Uo(e) {
  var t = e._init;
  return t(e._payload);
}
function _a(e) {
  function t(f, a) {
    if (e) {
      var d = f.deletions;
      d === null ? ((f.deletions = [a]), (f.flags |= 16)) : d.push(a);
    }
  }
  function n(f, a) {
    if (!e) return null;
    for (; a !== null; ) (t(f, a), (a = a.sibling));
    return null;
  }
  function r(f, a) {
    for (f = new Map(); a !== null; )
      (a.key !== null ? f.set(a.key, a) : f.set(a.index, a), (a = a.sibling));
    return f;
  }
  function l(f, a) {
    return ((f = Nt(f, a)), (f.index = 0), (f.sibling = null), f);
  }
  function i(f, a, d) {
    return (
      (f.index = d),
      e
        ? ((d = f.alternate),
          d !== null
            ? ((d = d.index), d < a ? ((f.flags |= 2), a) : d)
            : ((f.flags |= 2), a))
        : ((f.flags |= 1048576), a)
    );
  }
  function u(f) {
    return (e && f.alternate === null && (f.flags |= 2), f);
  }
  function o(f, a, d, v) {
    return a === null || a.tag !== 6
      ? ((a = ui(d, f.mode, v)), (a.return = f), a)
      : ((a = l(a, d)), (a.return = f), a);
  }
  function s(f, a, d, v) {
    var E = d.type;
    return E === Zt
      ? m(f, a, d.props.children, v, d.key)
      : a !== null &&
          (a.elementType === E ||
            (typeof E == "object" &&
              E !== null &&
              E.$$typeof === dt &&
              Uo(E) === a.type))
        ? ((v = l(a, d.props)), (v.ref = Ln(f, a, d)), (v.return = f), v)
        : ((v = Kr(d.type, d.key, d.props, null, f.mode, v)),
          (v.ref = Ln(f, a, d)),
          (v.return = f),
          v);
  }
  function c(f, a, d, v) {
    return a === null ||
      a.tag !== 4 ||
      a.stateNode.containerInfo !== d.containerInfo ||
      a.stateNode.implementation !== d.implementation
      ? ((a = oi(d, f.mode, v)), (a.return = f), a)
      : ((a = l(a, d.children || [])), (a.return = f), a);
  }
  function m(f, a, d, v, E) {
    return a === null || a.tag !== 7
      ? ((a = $t(d, f.mode, v, E)), (a.return = f), a)
      : ((a = l(a, d)), (a.return = f), a);
  }
  function h(f, a, d) {
    if ((typeof a == "string" && a !== "") || typeof a == "number")
      return ((a = ui("" + a, f.mode, d)), (a.return = f), a);
    if (typeof a == "object" && a !== null) {
      switch (a.$$typeof) {
        case wr:
          return (
            (d = Kr(a.type, a.key, a.props, null, f.mode, d)),
            (d.ref = Ln(f, null, a)),
            (d.return = f),
            d
          );
        case Gt:
          return ((a = oi(a, f.mode, d)), (a.return = f), a);
        case dt:
          var v = a._init;
          return h(f, v(a._payload), d);
      }
      if (In(a) || _n(a))
        return ((a = $t(a, f.mode, d, null)), (a.return = f), a);
      jr(f, a);
    }
    return null;
  }
  function p(f, a, d, v) {
    var E = a !== null ? a.key : null;
    if ((typeof d == "string" && d !== "") || typeof d == "number")
      return E !== null ? null : o(f, a, "" + d, v);
    if (typeof d == "object" && d !== null) {
      switch (d.$$typeof) {
        case wr:
          return d.key === E ? s(f, a, d, v) : null;
        case Gt:
          return d.key === E ? c(f, a, d, v) : null;
        case dt:
          return ((E = d._init), p(f, a, E(d._payload), v));
      }
      if (In(d) || _n(d)) return E !== null ? null : m(f, a, d, v, null);
      jr(f, d);
    }
    return null;
  }
  function k(f, a, d, v, E) {
    if ((typeof v == "string" && v !== "") || typeof v == "number")
      return ((f = f.get(d) || null), o(a, f, "" + v, E));
    if (typeof v == "object" && v !== null) {
      switch (v.$$typeof) {
        case wr:
          return (
            (f = f.get(v.key === null ? d : v.key) || null),
            s(a, f, v, E)
          );
        case Gt:
          return (
            (f = f.get(v.key === null ? d : v.key) || null),
            c(a, f, v, E)
          );
        case dt:
          var _ = v._init;
          return k(f, a, d, _(v._payload), E);
      }
      if (In(v) || _n(v)) return ((f = f.get(d) || null), m(a, f, v, E, null));
      jr(a, v);
    }
    return null;
  }
  function S(f, a, d, v) {
    for (
      var E = null, _ = null, w = a, P = (a = 0), R = null;
      w !== null && P < d.length;
      P++
    ) {
      w.index > P ? ((R = w), (w = null)) : (R = w.sibling);
      var I = p(f, w, d[P], v);
      if (I === null) {
        w === null && (w = R);
        break;
      }
      (e && w && I.alternate === null && t(f, w),
        (a = i(I, a, P)),
        _ === null ? (E = I) : (_.sibling = I),
        (_ = I),
        (w = R));
    }
    if (P === d.length) return (n(f, w), K && Lt(f, P), E);
    if (w === null) {
      for (; P < d.length; P++)
        ((w = h(f, d[P], v)),
          w !== null &&
            ((a = i(w, a, P)),
            _ === null ? (E = w) : (_.sibling = w),
            (_ = w)));
      return (K && Lt(f, P), E);
    }
    for (w = r(f, w); P < d.length; P++)
      ((R = k(w, f, P, d[P], v)),
        R !== null &&
          (e && R.alternate !== null && w.delete(R.key === null ? P : R.key),
          (a = i(R, a, P)),
          _ === null ? (E = R) : (_.sibling = R),
          (_ = R)));
    return (
      e &&
        w.forEach(function (V) {
          return t(f, V);
        }),
      K && Lt(f, P),
      E
    );
  }
  function x(f, a, d, v) {
    var E = _n(d);
    if (typeof E != "function") throw Error(y(150));
    if (((d = E.call(d)), d == null)) throw Error(y(151));
    for (
      var _ = (E = null), w = a, P = (a = 0), R = null, I = d.next();
      w !== null && !I.done;
      P++, I = d.next()
    ) {
      w.index > P ? ((R = w), (w = null)) : (R = w.sibling);
      var V = p(f, w, I.value, v);
      if (V === null) {
        w === null && (w = R);
        break;
      }
      (e && w && V.alternate === null && t(f, w),
        (a = i(V, a, P)),
        _ === null ? (E = V) : (_.sibling = V),
        (_ = V),
        (w = R));
    }
    if (I.done) return (n(f, w), K && Lt(f, P), E);
    if (w === null) {
      for (; !I.done; P++, I = d.next())
        ((I = h(f, I.value, v)),
          I !== null &&
            ((a = i(I, a, P)),
            _ === null ? (E = I) : (_.sibling = I),
            (_ = I)));
      return (K && Lt(f, P), E);
    }
    for (w = r(f, w); !I.done; P++, I = d.next())
      ((I = k(w, f, P, I.value, v)),
        I !== null &&
          (e && I.alternate !== null && w.delete(I.key === null ? P : I.key),
          (a = i(I, a, P)),
          _ === null ? (E = I) : (_.sibling = I),
          (_ = I)));
    return (
      e &&
        w.forEach(function (Te) {
          return t(f, Te);
        }),
      K && Lt(f, P),
      E
    );
  }
  function L(f, a, d, v) {
    if (
      (typeof d == "object" &&
        d !== null &&
        d.type === Zt &&
        d.key === null &&
        (d = d.props.children),
      typeof d == "object" && d !== null)
    ) {
      switch (d.$$typeof) {
        case wr:
          e: {
            for (var E = d.key, _ = a; _ !== null; ) {
              if (_.key === E) {
                if (((E = d.type), E === Zt)) {
                  if (_.tag === 7) {
                    (n(f, _.sibling),
                      (a = l(_, d.props.children)),
                      (a.return = f),
                      (f = a));
                    break e;
                  }
                } else if (
                  _.elementType === E ||
                  (typeof E == "object" &&
                    E !== null &&
                    E.$$typeof === dt &&
                    Uo(E) === _.type)
                ) {
                  (n(f, _.sibling),
                    (a = l(_, d.props)),
                    (a.ref = Ln(f, _, d)),
                    (a.return = f),
                    (f = a));
                  break e;
                }
                n(f, _);
                break;
              } else t(f, _);
              _ = _.sibling;
            }
            d.type === Zt
              ? ((a = $t(d.props.children, f.mode, v, d.key)),
                (a.return = f),
                (f = a))
              : ((v = Kr(d.type, d.key, d.props, null, f.mode, v)),
                (v.ref = Ln(f, a, d)),
                (v.return = f),
                (f = v));
          }
          return u(f);
        case Gt:
          e: {
            for (_ = d.key; a !== null; ) {
              if (a.key === _)
                if (
                  a.tag === 4 &&
                  a.stateNode.containerInfo === d.containerInfo &&
                  a.stateNode.implementation === d.implementation
                ) {
                  (n(f, a.sibling),
                    (a = l(a, d.children || [])),
                    (a.return = f),
                    (f = a));
                  break e;
                } else {
                  n(f, a);
                  break;
                }
              else t(f, a);
              a = a.sibling;
            }
            ((a = oi(d, f.mode, v)), (a.return = f), (f = a));
          }
          return u(f);
        case dt:
          return ((_ = d._init), L(f, a, _(d._payload), v));
      }
      if (In(d)) return S(f, a, d, v);
      if (_n(d)) return x(f, a, d, v);
      jr(f, d);
    }
    return (typeof d == "string" && d !== "") || typeof d == "number"
      ? ((d = "" + d),
        a !== null && a.tag === 6
          ? (n(f, a.sibling), (a = l(a, d)), (a.return = f), (f = a))
          : (n(f, a), (a = ui(d, f.mode, v)), (a.return = f), (f = a)),
        u(f))
      : n(f, a);
  }
  return L;
}
var yn = _a(!0),
  Pa = _a(!1),
  ol = Tt(null),
  sl = null,
  ln = null,
  _u = null;
function Pu() {
  _u = ln = sl = null;
}
function zu(e) {
  var t = ol.current;
  (W(ol), (e._currentValue = t));
}
function Ui(e, t, n) {
  for (; e !== null; ) {
    var r = e.alternate;
    if (
      ((e.childLanes & t) !== t
        ? ((e.childLanes |= t), r !== null && (r.childLanes |= t))
        : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t),
      e === n)
    )
      break;
    e = e.return;
  }
}
function pn(e, t) {
  ((sl = e),
    (_u = ln = null),
    (e = e.dependencies),
    e !== null &&
      e.firstContext !== null &&
      (e.lanes & t && (ge = !0), (e.firstContext = null)));
}
function Oe(e) {
  var t = e._currentValue;
  if (_u !== e)
    if (((e = { context: e, memoizedValue: t, next: null }), ln === null)) {
      if (sl === null) throw Error(y(308));
      ((ln = e), (sl.dependencies = { lanes: 0, firstContext: e }));
    } else ln = ln.next = e;
  return t;
}
var Ot = null;
function Tu(e) {
  Ot === null ? (Ot = [e]) : Ot.push(e);
}
function za(e, t, n, r) {
  var l = t.interleaved;
  return (
    l === null ? ((n.next = n), Tu(t)) : ((n.next = l.next), (l.next = n)),
    (t.interleaved = n),
    ut(e, r)
  );
}
function ut(e, t) {
  e.lanes |= t;
  var n = e.alternate;
  for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; )
    ((e.childLanes |= t),
      (n = e.alternate),
      n !== null && (n.childLanes |= t),
      (n = e),
      (e = e.return));
  return n.tag === 3 ? n.stateNode : null;
}
var pt = !1;
function ju(e) {
  e.updateQueue = {
    baseState: e.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: { pending: null, interleaved: null, lanes: 0 },
    effects: null,
  };
}
function Ta(e, t) {
  ((e = e.updateQueue),
    t.updateQueue === e &&
      (t.updateQueue = {
        baseState: e.baseState,
        firstBaseUpdate: e.firstBaseUpdate,
        lastBaseUpdate: e.lastBaseUpdate,
        shared: e.shared,
        effects: e.effects,
      }));
}
function rt(e, t) {
  return {
    eventTime: e,
    lane: t,
    tag: 0,
    payload: null,
    callback: null,
    next: null,
  };
}
function xt(e, t, n) {
  var r = e.updateQueue;
  if (r === null) return null;
  if (((r = r.shared), $ & 2)) {
    var l = r.pending;
    return (
      l === null ? (t.next = t) : ((t.next = l.next), (l.next = t)),
      (r.pending = t),
      ut(e, n)
    );
  }
  return (
    (l = r.interleaved),
    l === null ? ((t.next = t), Tu(r)) : ((t.next = l.next), (l.next = t)),
    (r.interleaved = t),
    ut(e, n)
  );
}
function Ar(e, t, n) {
  if (
    ((t = t.updateQueue), t !== null && ((t = t.shared), (n & 4194240) !== 0))
  ) {
    var r = t.lanes;
    ((r &= e.pendingLanes), (n |= r), (t.lanes = n), mu(e, n));
  }
}
function Ao(e, t) {
  var n = e.updateQueue,
    r = e.alternate;
  if (r !== null && ((r = r.updateQueue), n === r)) {
    var l = null,
      i = null;
    if (((n = n.firstBaseUpdate), n !== null)) {
      do {
        var u = {
          eventTime: n.eventTime,
          lane: n.lane,
          tag: n.tag,
          payload: n.payload,
          callback: n.callback,
          next: null,
        };
        (i === null ? (l = i = u) : (i = i.next = u), (n = n.next));
      } while (n !== null);
      i === null ? (l = i = t) : (i = i.next = t);
    } else l = i = t;
    ((n = {
      baseState: r.baseState,
      firstBaseUpdate: l,
      lastBaseUpdate: i,
      shared: r.shared,
      effects: r.effects,
    }),
      (e.updateQueue = n));
    return;
  }
  ((e = n.lastBaseUpdate),
    e === null ? (n.firstBaseUpdate = t) : (e.next = t),
    (n.lastBaseUpdate = t));
}
function al(e, t, n, r) {
  var l = e.updateQueue;
  pt = !1;
  var i = l.firstBaseUpdate,
    u = l.lastBaseUpdate,
    o = l.shared.pending;
  if (o !== null) {
    l.shared.pending = null;
    var s = o,
      c = s.next;
    ((s.next = null), u === null ? (i = c) : (u.next = c), (u = s));
    var m = e.alternate;
    m !== null &&
      ((m = m.updateQueue),
      (o = m.lastBaseUpdate),
      o !== u &&
        (o === null ? (m.firstBaseUpdate = c) : (o.next = c),
        (m.lastBaseUpdate = s)));
  }
  if (i !== null) {
    var h = l.baseState;
    ((u = 0), (m = c = s = null), (o = i));
    do {
      var p = o.lane,
        k = o.eventTime;
      if ((r & p) === p) {
        m !== null &&
          (m = m.next =
            {
              eventTime: k,
              lane: 0,
              tag: o.tag,
              payload: o.payload,
              callback: o.callback,
              next: null,
            });
        e: {
          var S = e,
            x = o;
          switch (((p = t), (k = n), x.tag)) {
            case 1:
              if (((S = x.payload), typeof S == "function")) {
                h = S.call(k, h, p);
                break e;
              }
              h = S;
              break e;
            case 3:
              S.flags = (S.flags & -65537) | 128;
            case 0:
              if (
                ((S = x.payload),
                (p = typeof S == "function" ? S.call(k, h, p) : S),
                p == null)
              )
                break e;
              h = Z({}, h, p);
              break e;
            case 2:
              pt = !0;
          }
        }
        o.callback !== null &&
          o.lane !== 0 &&
          ((e.flags |= 64),
          (p = l.effects),
          p === null ? (l.effects = [o]) : p.push(o));
      } else
        ((k = {
          eventTime: k,
          lane: p,
          tag: o.tag,
          payload: o.payload,
          callback: o.callback,
          next: null,
        }),
          m === null ? ((c = m = k), (s = h)) : (m = m.next = k),
          (u |= p));
      if (((o = o.next), o === null)) {
        if (((o = l.shared.pending), o === null)) break;
        ((p = o),
          (o = p.next),
          (p.next = null),
          (l.lastBaseUpdate = p),
          (l.shared.pending = null));
      }
    } while (!0);
    if (
      (m === null && (s = h),
      (l.baseState = s),
      (l.firstBaseUpdate = c),
      (l.lastBaseUpdate = m),
      (t = l.shared.interleaved),
      t !== null)
    ) {
      l = t;
      do ((u |= l.lane), (l = l.next));
      while (l !== t);
    } else i === null && (l.shared.lanes = 0);
    ((Bt |= u), (e.lanes = u), (e.memoizedState = h));
  }
}
function Vo(e, t, n) {
  if (((e = t.effects), (t.effects = null), e !== null))
    for (t = 0; t < e.length; t++) {
      var r = e[t],
        l = r.callback;
      if (l !== null) {
        if (((r.callback = null), (r = n), typeof l != "function"))
          throw Error(y(191, l));
        l.call(r);
      }
    }
}
var hr = {},
  Ge = Tt(hr),
  lr = Tt(hr),
  ir = Tt(hr);
function It(e) {
  if (e === hr) throw Error(y(174));
  return e;
}
function Lu(e, t) {
  switch ((A(ir, t), A(lr, e), A(Ge, hr), (e = t.nodeType), e)) {
    case 9:
    case 11:
      t = (t = t.documentElement) ? t.namespaceURI : wi(null, "");
      break;
    default:
      ((e = e === 8 ? t.parentNode : t),
        (t = e.namespaceURI || null),
        (e = e.tagName),
        (t = wi(t, e)));
  }
  (W(Ge), A(Ge, t));
}
function wn() {
  (W(Ge), W(lr), W(ir));
}
function ja(e) {
  It(ir.current);
  var t = It(Ge.current),
    n = wi(t, e.type);
  t !== n && (A(lr, e), A(Ge, n));
}
function Ru(e) {
  lr.current === e && (W(Ge), W(lr));
}
var Y = Tt(0);
function cl(e) {
  for (var t = e; t !== null; ) {
    if (t.tag === 13) {
      var n = t.memoizedState;
      if (
        n !== null &&
        ((n = n.dehydrated), n === null || n.data === "$?" || n.data === "$!")
      )
        return t;
    } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
      if (t.flags & 128) return t;
    } else if (t.child !== null) {
      ((t.child.return = t), (t = t.child));
      continue;
    }
    if (t === e) break;
    for (; t.sibling === null; ) {
      if (t.return === null || t.return === e) return null;
      t = t.return;
    }
    ((t.sibling.return = t.return), (t = t.sibling));
  }
  return null;
}
var ei = [];
function Mu() {
  for (var e = 0; e < ei.length; e++)
    ei[e]._workInProgressVersionPrimary = null;
  ei.length = 0;
}
var Vr = st.ReactCurrentDispatcher,
  ti = st.ReactCurrentBatchConfig,
  Vt = 0,
  G = null,
  te = null,
  re = null,
  fl = !1,
  Hn = !1,
  ur = 0,
  Nd = 0;
function se() {
  throw Error(y(321));
}
function Ou(e, t) {
  if (t === null) return !1;
  for (var n = 0; n < t.length && n < e.length; n++)
    if (!Be(e[n], t[n])) return !1;
  return !0;
}
function Iu(e, t, n, r, l, i) {
  if (
    ((Vt = i),
    (G = t),
    (t.memoizedState = null),
    (t.updateQueue = null),
    (t.lanes = 0),
    (Vr.current = e === null || e.memoizedState === null ? Td : jd),
    (e = n(r, l)),
    Hn)
  ) {
    i = 0;
    do {
      if (((Hn = !1), (ur = 0), 25 <= i)) throw Error(y(301));
      ((i += 1),
        (re = te = null),
        (t.updateQueue = null),
        (Vr.current = Ld),
        (e = n(r, l)));
    } while (Hn);
  }
  if (
    ((Vr.current = dl),
    (t = te !== null && te.next !== null),
    (Vt = 0),
    (re = te = G = null),
    (fl = !1),
    t)
  )
    throw Error(y(300));
  return e;
}
function Du() {
  var e = ur !== 0;
  return ((ur = 0), e);
}
function Ke() {
  var e = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null,
  };
  return (re === null ? (G.memoizedState = re = e) : (re = re.next = e), re);
}
function Ie() {
  if (te === null) {
    var e = G.alternate;
    e = e !== null ? e.memoizedState : null;
  } else e = te.next;
  var t = re === null ? G.memoizedState : re.next;
  if (t !== null) ((re = t), (te = e));
  else {
    if (e === null) throw Error(y(310));
    ((te = e),
      (e = {
        memoizedState: te.memoizedState,
        baseState: te.baseState,
        baseQueue: te.baseQueue,
        queue: te.queue,
        next: null,
      }),
      re === null ? (G.memoizedState = re = e) : (re = re.next = e));
  }
  return re;
}
function or(e, t) {
  return typeof t == "function" ? t(e) : t;
}
function ni(e) {
  var t = Ie(),
    n = t.queue;
  if (n === null) throw Error(y(311));
  n.lastRenderedReducer = e;
  var r = te,
    l = r.baseQueue,
    i = n.pending;
  if (i !== null) {
    if (l !== null) {
      var u = l.next;
      ((l.next = i.next), (i.next = u));
    }
    ((r.baseQueue = l = i), (n.pending = null));
  }
  if (l !== null) {
    ((i = l.next), (r = r.baseState));
    var o = (u = null),
      s = null,
      c = i;
    do {
      var m = c.lane;
      if ((Vt & m) === m)
        (s !== null &&
          (s = s.next =
            {
              lane: 0,
              action: c.action,
              hasEagerState: c.hasEagerState,
              eagerState: c.eagerState,
              next: null,
            }),
          (r = c.hasEagerState ? c.eagerState : e(r, c.action)));
      else {
        var h = {
          lane: m,
          action: c.action,
          hasEagerState: c.hasEagerState,
          eagerState: c.eagerState,
          next: null,
        };
        (s === null ? ((o = s = h), (u = r)) : (s = s.next = h),
          (G.lanes |= m),
          (Bt |= m));
      }
      c = c.next;
    } while (c !== null && c !== i);
    (s === null ? (u = r) : (s.next = o),
      Be(r, t.memoizedState) || (ge = !0),
      (t.memoizedState = r),
      (t.baseState = u),
      (t.baseQueue = s),
      (n.lastRenderedState = r));
  }
  if (((e = n.interleaved), e !== null)) {
    l = e;
    do ((i = l.lane), (G.lanes |= i), (Bt |= i), (l = l.next));
    while (l !== e);
  } else l === null && (n.lanes = 0);
  return [t.memoizedState, n.dispatch];
}
function ri(e) {
  var t = Ie(),
    n = t.queue;
  if (n === null) throw Error(y(311));
  n.lastRenderedReducer = e;
  var r = n.dispatch,
    l = n.pending,
    i = t.memoizedState;
  if (l !== null) {
    n.pending = null;
    var u = (l = l.next);
    do ((i = e(i, u.action)), (u = u.next));
    while (u !== l);
    (Be(i, t.memoizedState) || (ge = !0),
      (t.memoizedState = i),
      t.baseQueue === null && (t.baseState = i),
      (n.lastRenderedState = i));
  }
  return [i, r];
}
function La() {}
function Ra(e, t) {
  var n = G,
    r = Ie(),
    l = t(),
    i = !Be(r.memoizedState, l);
  if (
    (i && ((r.memoizedState = l), (ge = !0)),
    (r = r.queue),
    Fu(Ia.bind(null, n, r, e), [e]),
    r.getSnapshot !== t || i || (re !== null && re.memoizedState.tag & 1))
  ) {
    if (
      ((n.flags |= 2048),
      sr(9, Oa.bind(null, n, r, l, t), void 0, null),
      le === null)
    )
      throw Error(y(349));
    Vt & 30 || Ma(n, t, l);
  }
  return l;
}
function Ma(e, t, n) {
  ((e.flags |= 16384),
    (e = { getSnapshot: t, value: n }),
    (t = G.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (G.updateQueue = t),
        (t.stores = [e]))
      : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e)));
}
function Oa(e, t, n, r) {
  ((t.value = n), (t.getSnapshot = r), Da(t) && Fa(e));
}
function Ia(e, t, n) {
  return n(function () {
    Da(t) && Fa(e);
  });
}
function Da(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !Be(e, n);
  } catch {
    return !0;
  }
}
function Fa(e) {
  var t = ut(e, 1);
  t !== null && Ve(t, e, 1, -1);
}
function Bo(e) {
  var t = Ke();
  return (
    typeof e == "function" && (e = e()),
    (t.memoizedState = t.baseState = e),
    (e = {
      pending: null,
      interleaved: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: or,
      lastRenderedState: e,
    }),
    (t.queue = e),
    (e = e.dispatch = zd.bind(null, G, e)),
    [t.memoizedState, e]
  );
}
function sr(e, t, n, r) {
  return (
    (e = { tag: e, create: t, destroy: n, deps: r, next: null }),
    (t = G.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (G.updateQueue = t),
        (t.lastEffect = e.next = e))
      : ((n = t.lastEffect),
        n === null
          ? (t.lastEffect = e.next = e)
          : ((r = n.next), (n.next = e), (e.next = r), (t.lastEffect = e))),
    e
  );
}
function $a() {
  return Ie().memoizedState;
}
function Br(e, t, n, r) {
  var l = Ke();
  ((G.flags |= e),
    (l.memoizedState = sr(1 | t, n, void 0, r === void 0 ? null : r)));
}
function Nl(e, t, n, r) {
  var l = Ie();
  r = r === void 0 ? null : r;
  var i = void 0;
  if (te !== null) {
    var u = te.memoizedState;
    if (((i = u.destroy), r !== null && Ou(r, u.deps))) {
      l.memoizedState = sr(t, n, i, r);
      return;
    }
  }
  ((G.flags |= e), (l.memoizedState = sr(1 | t, n, i, r)));
}
function Ho(e, t) {
  return Br(8390656, 8, e, t);
}
function Fu(e, t) {
  return Nl(2048, 8, e, t);
}
function Ua(e, t) {
  return Nl(4, 2, e, t);
}
function Aa(e, t) {
  return Nl(4, 4, e, t);
}
function Va(e, t) {
  if (typeof t == "function")
    return (
      (e = e()),
      t(e),
      function () {
        t(null);
      }
    );
  if (t != null)
    return (
      (e = e()),
      (t.current = e),
      function () {
        t.current = null;
      }
    );
}
function Ba(e, t, n) {
  return (
    (n = n != null ? n.concat([e]) : null),
    Nl(4, 4, Va.bind(null, t, e), n)
  );
}
function $u() {}
function Ha(e, t) {
  var n = Ie();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && Ou(t, r[1])
    ? r[0]
    : ((n.memoizedState = [e, t]), e);
}
function Wa(e, t) {
  var n = Ie();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && Ou(t, r[1])
    ? r[0]
    : ((e = e()), (n.memoizedState = [e, t]), e);
}
function Qa(e, t, n) {
  return Vt & 21
    ? (Be(n, t) || ((n = Zs()), (G.lanes |= n), (Bt |= n), (e.baseState = !0)),
      t)
    : (e.baseState && ((e.baseState = !1), (ge = !0)), (e.memoizedState = n));
}
function _d(e, t) {
  var n = U;
  ((U = n !== 0 && 4 > n ? n : 4), e(!0));
  var r = ti.transition;
  ti.transition = {};
  try {
    (e(!1), t());
  } finally {
    ((U = n), (ti.transition = r));
  }
}
function Ka() {
  return Ie().memoizedState;
}
function Pd(e, t, n) {
  var r = Ct(e);
  if (
    ((n = {
      lane: r,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
    Xa(e))
  )
    Ya(t, n);
  else if (((n = za(e, t, n, r)), n !== null)) {
    var l = pe();
    (Ve(n, e, r, l), Ga(n, t, r));
  }
}
function zd(e, t, n) {
  var r = Ct(e),
    l = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
  if (Xa(e)) Ya(t, l);
  else {
    var i = e.alternate;
    if (
      e.lanes === 0 &&
      (i === null || i.lanes === 0) &&
      ((i = t.lastRenderedReducer), i !== null)
    )
      try {
        var u = t.lastRenderedState,
          o = i(u, n);
        if (((l.hasEagerState = !0), (l.eagerState = o), Be(o, u))) {
          var s = t.interleaved;
          (s === null
            ? ((l.next = l), Tu(t))
            : ((l.next = s.next), (s.next = l)),
            (t.interleaved = l));
          return;
        }
      } catch {
      } finally {
      }
    ((n = za(e, t, l, r)),
      n !== null && ((l = pe()), Ve(n, e, r, l), Ga(n, t, r)));
  }
}
function Xa(e) {
  var t = e.alternate;
  return e === G || (t !== null && t === G);
}
function Ya(e, t) {
  Hn = fl = !0;
  var n = e.pending;
  (n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)),
    (e.pending = t));
}
function Ga(e, t, n) {
  if (n & 4194240) {
    var r = t.lanes;
    ((r &= e.pendingLanes), (n |= r), (t.lanes = n), mu(e, n));
  }
}
var dl = {
    readContext: Oe,
    useCallback: se,
    useContext: se,
    useEffect: se,
    useImperativeHandle: se,
    useInsertionEffect: se,
    useLayoutEffect: se,
    useMemo: se,
    useReducer: se,
    useRef: se,
    useState: se,
    useDebugValue: se,
    useDeferredValue: se,
    useTransition: se,
    useMutableSource: se,
    useSyncExternalStore: se,
    useId: se,
    unstable_isNewReconciler: !1,
  },
  Td = {
    readContext: Oe,
    useCallback: function (e, t) {
      return ((Ke().memoizedState = [e, t === void 0 ? null : t]), e);
    },
    useContext: Oe,
    useEffect: Ho,
    useImperativeHandle: function (e, t, n) {
      return (
        (n = n != null ? n.concat([e]) : null),
        Br(4194308, 4, Va.bind(null, t, e), n)
      );
    },
    useLayoutEffect: function (e, t) {
      return Br(4194308, 4, e, t);
    },
    useInsertionEffect: function (e, t) {
      return Br(4, 2, e, t);
    },
    useMemo: function (e, t) {
      var n = Ke();
      return (
        (t = t === void 0 ? null : t),
        (e = e()),
        (n.memoizedState = [e, t]),
        e
      );
    },
    useReducer: function (e, t, n) {
      var r = Ke();
      return (
        (t = n !== void 0 ? n(t) : t),
        (r.memoizedState = r.baseState = t),
        (e = {
          pending: null,
          interleaved: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: e,
          lastRenderedState: t,
        }),
        (r.queue = e),
        (e = e.dispatch = Pd.bind(null, G, e)),
        [r.memoizedState, e]
      );
    },
    useRef: function (e) {
      var t = Ke();
      return ((e = { current: e }), (t.memoizedState = e));
    },
    useState: Bo,
    useDebugValue: $u,
    useDeferredValue: function (e) {
      return (Ke().memoizedState = e);
    },
    useTransition: function () {
      var e = Bo(!1),
        t = e[0];
      return ((e = _d.bind(null, e[1])), (Ke().memoizedState = e), [t, e]);
    },
    useMutableSource: function () {},
    useSyncExternalStore: function (e, t, n) {
      var r = G,
        l = Ke();
      if (K) {
        if (n === void 0) throw Error(y(407));
        n = n();
      } else {
        if (((n = t()), le === null)) throw Error(y(349));
        Vt & 30 || Ma(r, t, n);
      }
      l.memoizedState = n;
      var i = { value: n, getSnapshot: t };
      return (
        (l.queue = i),
        Ho(Ia.bind(null, r, i, e), [e]),
        (r.flags |= 2048),
        sr(9, Oa.bind(null, r, i, n, t), void 0, null),
        n
      );
    },
    useId: function () {
      var e = Ke(),
        t = le.identifierPrefix;
      if (K) {
        var n = nt,
          r = tt;
        ((n = (r & ~(1 << (32 - Ae(r) - 1))).toString(32) + n),
          (t = ":" + t + "R" + n),
          (n = ur++),
          0 < n && (t += "H" + n.toString(32)),
          (t += ":"));
      } else ((n = Nd++), (t = ":" + t + "r" + n.toString(32) + ":"));
      return (e.memoizedState = t);
    },
    unstable_isNewReconciler: !1,
  },
  jd = {
    readContext: Oe,
    useCallback: Ha,
    useContext: Oe,
    useEffect: Fu,
    useImperativeHandle: Ba,
    useInsertionEffect: Ua,
    useLayoutEffect: Aa,
    useMemo: Wa,
    useReducer: ni,
    useRef: $a,
    useState: function () {
      return ni(or);
    },
    useDebugValue: $u,
    useDeferredValue: function (e) {
      var t = Ie();
      return Qa(t, te.memoizedState, e);
    },
    useTransition: function () {
      var e = ni(or)[0],
        t = Ie().memoizedState;
      return [e, t];
    },
    useMutableSource: La,
    useSyncExternalStore: Ra,
    useId: Ka,
    unstable_isNewReconciler: !1,
  },
  Ld = {
    readContext: Oe,
    useCallback: Ha,
    useContext: Oe,
    useEffect: Fu,
    useImperativeHandle: Ba,
    useInsertionEffect: Ua,
    useLayoutEffect: Aa,
    useMemo: Wa,
    useReducer: ri,
    useRef: $a,
    useState: function () {
      return ri(or);
    },
    useDebugValue: $u,
    useDeferredValue: function (e) {
      var t = Ie();
      return te === null ? (t.memoizedState = e) : Qa(t, te.memoizedState, e);
    },
    useTransition: function () {
      var e = ri(or)[0],
        t = Ie().memoizedState;
      return [e, t];
    },
    useMutableSource: La,
    useSyncExternalStore: Ra,
    useId: Ka,
    unstable_isNewReconciler: !1,
  };
function Fe(e, t) {
  if (e && e.defaultProps) {
    ((t = Z({}, t)), (e = e.defaultProps));
    for (var n in e) t[n] === void 0 && (t[n] = e[n]);
    return t;
  }
  return t;
}
function Ai(e, t, n, r) {
  ((t = e.memoizedState),
    (n = n(r, t)),
    (n = n == null ? t : Z({}, t, n)),
    (e.memoizedState = n),
    e.lanes === 0 && (e.updateQueue.baseState = n));
}
var _l = {
  isMounted: function (e) {
    return (e = e._reactInternals) ? Qt(e) === e : !1;
  },
  enqueueSetState: function (e, t, n) {
    e = e._reactInternals;
    var r = pe(),
      l = Ct(e),
      i = rt(r, l);
    ((i.payload = t),
      n != null && (i.callback = n),
      (t = xt(e, i, l)),
      t !== null && (Ve(t, e, l, r), Ar(t, e, l)));
  },
  enqueueReplaceState: function (e, t, n) {
    e = e._reactInternals;
    var r = pe(),
      l = Ct(e),
      i = rt(r, l);
    ((i.tag = 1),
      (i.payload = t),
      n != null && (i.callback = n),
      (t = xt(e, i, l)),
      t !== null && (Ve(t, e, l, r), Ar(t, e, l)));
  },
  enqueueForceUpdate: function (e, t) {
    e = e._reactInternals;
    var n = pe(),
      r = Ct(e),
      l = rt(n, r);
    ((l.tag = 2),
      t != null && (l.callback = t),
      (t = xt(e, l, r)),
      t !== null && (Ve(t, e, r, n), Ar(t, e, r)));
  },
};
function Wo(e, t, n, r, l, i, u) {
  return (
    (e = e.stateNode),
    typeof e.shouldComponentUpdate == "function"
      ? e.shouldComponentUpdate(r, i, u)
      : t.prototype && t.prototype.isPureReactComponent
        ? !er(n, r) || !er(l, i)
        : !0
  );
}
function Za(e, t, n) {
  var r = !1,
    l = Pt,
    i = t.contextType;
  return (
    typeof i == "object" && i !== null
      ? (i = Oe(i))
      : ((l = we(t) ? Ut : fe.current),
        (r = t.contextTypes),
        (i = (r = r != null) ? vn(e, l) : Pt)),
    (t = new t(n, i)),
    (e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null),
    (t.updater = _l),
    (e.stateNode = t),
    (t._reactInternals = e),
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = l),
      (e.__reactInternalMemoizedMaskedChildContext = i)),
    t
  );
}
function Qo(e, t, n, r) {
  ((e = t.state),
    typeof t.componentWillReceiveProps == "function" &&
      t.componentWillReceiveProps(n, r),
    typeof t.UNSAFE_componentWillReceiveProps == "function" &&
      t.UNSAFE_componentWillReceiveProps(n, r),
    t.state !== e && _l.enqueueReplaceState(t, t.state, null));
}
function Vi(e, t, n, r) {
  var l = e.stateNode;
  ((l.props = n), (l.state = e.memoizedState), (l.refs = {}), ju(e));
  var i = t.contextType;
  (typeof i == "object" && i !== null
    ? (l.context = Oe(i))
    : ((i = we(t) ? Ut : fe.current), (l.context = vn(e, i))),
    (l.state = e.memoizedState),
    (i = t.getDerivedStateFromProps),
    typeof i == "function" && (Ai(e, t, i, n), (l.state = e.memoizedState)),
    typeof t.getDerivedStateFromProps == "function" ||
      typeof l.getSnapshotBeforeUpdate == "function" ||
      (typeof l.UNSAFE_componentWillMount != "function" &&
        typeof l.componentWillMount != "function") ||
      ((t = l.state),
      typeof l.componentWillMount == "function" && l.componentWillMount(),
      typeof l.UNSAFE_componentWillMount == "function" &&
        l.UNSAFE_componentWillMount(),
      t !== l.state && _l.enqueueReplaceState(l, l.state, null),
      al(e, n, l, r),
      (l.state = e.memoizedState)),
    typeof l.componentDidMount == "function" && (e.flags |= 4194308));
}
function kn(e, t) {
  try {
    var n = "",
      r = t;
    do ((n += lf(r)), (r = r.return));
    while (r);
    var l = n;
  } catch (i) {
    l =
      `
Error generating stack: ` +
      i.message +
      `
` +
      i.stack;
  }
  return { value: e, source: t, stack: l, digest: null };
}
function li(e, t, n) {
  return { value: e, source: null, stack: n ?? null, digest: t ?? null };
}
function Bi(e, t) {
  try {
    console.error(t.value);
  } catch (n) {
    setTimeout(function () {
      throw n;
    });
  }
}
var Rd = typeof WeakMap == "function" ? WeakMap : Map;
function Ja(e, t, n) {
  ((n = rt(-1, n)), (n.tag = 3), (n.payload = { element: null }));
  var r = t.value;
  return (
    (n.callback = function () {
      (hl || ((hl = !0), (qi = r)), Bi(e, t));
    }),
    n
  );
}
function qa(e, t, n) {
  ((n = rt(-1, n)), (n.tag = 3));
  var r = e.type.getDerivedStateFromError;
  if (typeof r == "function") {
    var l = t.value;
    ((n.payload = function () {
      return r(l);
    }),
      (n.callback = function () {
        Bi(e, t);
      }));
  }
  var i = e.stateNode;
  return (
    i !== null &&
      typeof i.componentDidCatch == "function" &&
      (n.callback = function () {
        (Bi(e, t),
          typeof r != "function" &&
            (Et === null ? (Et = new Set([this])) : Et.add(this)));
        var u = t.stack;
        this.componentDidCatch(t.value, {
          componentStack: u !== null ? u : "",
        });
      }),
    n
  );
}
function Ko(e, t, n) {
  var r = e.pingCache;
  if (r === null) {
    r = e.pingCache = new Rd();
    var l = new Set();
    r.set(t, l);
  } else ((l = r.get(t)), l === void 0 && ((l = new Set()), r.set(t, l)));
  l.has(n) || (l.add(n), (e = Kd.bind(null, e, t, n)), t.then(e, e));
}
function Xo(e) {
  do {
    var t;
    if (
      ((t = e.tag === 13) &&
        ((t = e.memoizedState), (t = t !== null ? t.dehydrated !== null : !0)),
      t)
    )
      return e;
    e = e.return;
  } while (e !== null);
  return null;
}
function Yo(e, t, n, r, l) {
  return e.mode & 1
    ? ((e.flags |= 65536), (e.lanes = l), e)
    : (e === t
        ? (e.flags |= 65536)
        : ((e.flags |= 128),
          (n.flags |= 131072),
          (n.flags &= -52805),
          n.tag === 1 &&
            (n.alternate === null
              ? (n.tag = 17)
              : ((t = rt(-1, 1)), (t.tag = 2), xt(n, t, 1))),
          (n.lanes |= 1)),
      e);
}
var Md = st.ReactCurrentOwner,
  ge = !1;
function de(e, t, n, r) {
  t.child = e === null ? Pa(t, null, n, r) : yn(t, e.child, n, r);
}
function Go(e, t, n, r, l) {
  n = n.render;
  var i = t.ref;
  return (
    pn(t, l),
    (r = Iu(e, t, n, r, i, l)),
    (n = Du()),
    e !== null && !ge
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~l),
        ot(e, t, l))
      : (K && n && Eu(t), (t.flags |= 1), de(e, t, r, l), t.child)
  );
}
function Zo(e, t, n, r, l) {
  if (e === null) {
    var i = n.type;
    return typeof i == "function" &&
      !Ku(i) &&
      i.defaultProps === void 0 &&
      n.compare === null &&
      n.defaultProps === void 0
      ? ((t.tag = 15), (t.type = i), ba(e, t, i, r, l))
      : ((e = Kr(n.type, null, r, t, t.mode, l)),
        (e.ref = t.ref),
        (e.return = t),
        (t.child = e));
  }
  if (((i = e.child), !(e.lanes & l))) {
    var u = i.memoizedProps;
    if (
      ((n = n.compare), (n = n !== null ? n : er), n(u, r) && e.ref === t.ref)
    )
      return ot(e, t, l);
  }
  return (
    (t.flags |= 1),
    (e = Nt(i, r)),
    (e.ref = t.ref),
    (e.return = t),
    (t.child = e)
  );
}
function ba(e, t, n, r, l) {
  if (e !== null) {
    var i = e.memoizedProps;
    if (er(i, r) && e.ref === t.ref)
      if (((ge = !1), (t.pendingProps = r = i), (e.lanes & l) !== 0))
        e.flags & 131072 && (ge = !0);
      else return ((t.lanes = e.lanes), ot(e, t, l));
  }
  return Hi(e, t, n, r, l);
}
function ec(e, t, n) {
  var r = t.pendingProps,
    l = r.children,
    i = e !== null ? e.memoizedState : null;
  if (r.mode === "hidden")
    if (!(t.mode & 1))
      ((t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        A(on, Ee),
        (Ee |= n));
    else {
      if (!(n & 1073741824))
        return (
          (e = i !== null ? i.baseLanes | n : n),
          (t.lanes = t.childLanes = 1073741824),
          (t.memoizedState = {
            baseLanes: e,
            cachePool: null,
            transitions: null,
          }),
          (t.updateQueue = null),
          A(on, Ee),
          (Ee |= e),
          null
        );
      ((t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        (r = i !== null ? i.baseLanes : n),
        A(on, Ee),
        (Ee |= r));
    }
  else
    (i !== null ? ((r = i.baseLanes | n), (t.memoizedState = null)) : (r = n),
      A(on, Ee),
      (Ee |= r));
  return (de(e, t, l, n), t.child);
}
function tc(e, t) {
  var n = t.ref;
  ((e === null && n !== null) || (e !== null && e.ref !== n)) &&
    ((t.flags |= 512), (t.flags |= 2097152));
}
function Hi(e, t, n, r, l) {
  var i = we(n) ? Ut : fe.current;
  return (
    (i = vn(t, i)),
    pn(t, l),
    (n = Iu(e, t, n, r, i, l)),
    (r = Du()),
    e !== null && !ge
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~l),
        ot(e, t, l))
      : (K && r && Eu(t), (t.flags |= 1), de(e, t, n, l), t.child)
  );
}
function Jo(e, t, n, r, l) {
  if (we(n)) {
    var i = !0;
    ll(t);
  } else i = !1;
  if ((pn(t, l), t.stateNode === null))
    (Hr(e, t), Za(t, n, r), Vi(t, n, r, l), (r = !0));
  else if (e === null) {
    var u = t.stateNode,
      o = t.memoizedProps;
    u.props = o;
    var s = u.context,
      c = n.contextType;
    typeof c == "object" && c !== null
      ? (c = Oe(c))
      : ((c = we(n) ? Ut : fe.current), (c = vn(t, c)));
    var m = n.getDerivedStateFromProps,
      h =
        typeof m == "function" ||
        typeof u.getSnapshotBeforeUpdate == "function";
    (h ||
      (typeof u.UNSAFE_componentWillReceiveProps != "function" &&
        typeof u.componentWillReceiveProps != "function") ||
      ((o !== r || s !== c) && Qo(t, u, r, c)),
      (pt = !1));
    var p = t.memoizedState;
    ((u.state = p),
      al(t, r, u, l),
      (s = t.memoizedState),
      o !== r || p !== s || ye.current || pt
        ? (typeof m == "function" && (Ai(t, n, m, r), (s = t.memoizedState)),
          (o = pt || Wo(t, n, o, r, p, s, c))
            ? (h ||
                (typeof u.UNSAFE_componentWillMount != "function" &&
                  typeof u.componentWillMount != "function") ||
                (typeof u.componentWillMount == "function" &&
                  u.componentWillMount(),
                typeof u.UNSAFE_componentWillMount == "function" &&
                  u.UNSAFE_componentWillMount()),
              typeof u.componentDidMount == "function" && (t.flags |= 4194308))
            : (typeof u.componentDidMount == "function" && (t.flags |= 4194308),
              (t.memoizedProps = r),
              (t.memoizedState = s)),
          (u.props = r),
          (u.state = s),
          (u.context = c),
          (r = o))
        : (typeof u.componentDidMount == "function" && (t.flags |= 4194308),
          (r = !1)));
  } else {
    ((u = t.stateNode),
      Ta(e, t),
      (o = t.memoizedProps),
      (c = t.type === t.elementType ? o : Fe(t.type, o)),
      (u.props = c),
      (h = t.pendingProps),
      (p = u.context),
      (s = n.contextType),
      typeof s == "object" && s !== null
        ? (s = Oe(s))
        : ((s = we(n) ? Ut : fe.current), (s = vn(t, s))));
    var k = n.getDerivedStateFromProps;
    ((m =
      typeof k == "function" ||
      typeof u.getSnapshotBeforeUpdate == "function") ||
      (typeof u.UNSAFE_componentWillReceiveProps != "function" &&
        typeof u.componentWillReceiveProps != "function") ||
      ((o !== h || p !== s) && Qo(t, u, r, s)),
      (pt = !1),
      (p = t.memoizedState),
      (u.state = p),
      al(t, r, u, l));
    var S = t.memoizedState;
    o !== h || p !== S || ye.current || pt
      ? (typeof k == "function" && (Ai(t, n, k, r), (S = t.memoizedState)),
        (c = pt || Wo(t, n, c, r, p, S, s) || !1)
          ? (m ||
              (typeof u.UNSAFE_componentWillUpdate != "function" &&
                typeof u.componentWillUpdate != "function") ||
              (typeof u.componentWillUpdate == "function" &&
                u.componentWillUpdate(r, S, s),
              typeof u.UNSAFE_componentWillUpdate == "function" &&
                u.UNSAFE_componentWillUpdate(r, S, s)),
            typeof u.componentDidUpdate == "function" && (t.flags |= 4),
            typeof u.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024))
          : (typeof u.componentDidUpdate != "function" ||
              (o === e.memoizedProps && p === e.memoizedState) ||
              (t.flags |= 4),
            typeof u.getSnapshotBeforeUpdate != "function" ||
              (o === e.memoizedProps && p === e.memoizedState) ||
              (t.flags |= 1024),
            (t.memoizedProps = r),
            (t.memoizedState = S)),
        (u.props = r),
        (u.state = S),
        (u.context = s),
        (r = c))
      : (typeof u.componentDidUpdate != "function" ||
          (o === e.memoizedProps && p === e.memoizedState) ||
          (t.flags |= 4),
        typeof u.getSnapshotBeforeUpdate != "function" ||
          (o === e.memoizedProps && p === e.memoizedState) ||
          (t.flags |= 1024),
        (r = !1));
  }
  return Wi(e, t, n, r, i, l);
}
function Wi(e, t, n, r, l, i) {
  tc(e, t);
  var u = (t.flags & 128) !== 0;
  if (!r && !u) return (l && Do(t, n, !1), ot(e, t, i));
  ((r = t.stateNode), (Md.current = t));
  var o =
    u && typeof n.getDerivedStateFromError != "function" ? null : r.render();
  return (
    (t.flags |= 1),
    e !== null && u
      ? ((t.child = yn(t, e.child, null, i)), (t.child = yn(t, null, o, i)))
      : de(e, t, o, i),
    (t.memoizedState = r.state),
    l && Do(t, n, !0),
    t.child
  );
}
function nc(e) {
  var t = e.stateNode;
  (t.pendingContext
    ? Io(e, t.pendingContext, t.pendingContext !== t.context)
    : t.context && Io(e, t.context, !1),
    Lu(e, t.containerInfo));
}
function qo(e, t, n, r, l) {
  return (gn(), Nu(l), (t.flags |= 256), de(e, t, n, r), t.child);
}
var Qi = { dehydrated: null, treeContext: null, retryLane: 0 };
function Ki(e) {
  return { baseLanes: e, cachePool: null, transitions: null };
}
function rc(e, t, n) {
  var r = t.pendingProps,
    l = Y.current,
    i = !1,
    u = (t.flags & 128) !== 0,
    o;
  if (
    ((o = u) ||
      (o = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0),
    o
      ? ((i = !0), (t.flags &= -129))
      : (e === null || e.memoizedState !== null) && (l |= 1),
    A(Y, l & 1),
    e === null)
  )
    return (
      $i(t),
      (e = t.memoizedState),
      e !== null && ((e = e.dehydrated), e !== null)
        ? (t.mode & 1
            ? e.data === "$!"
              ? (t.lanes = 8)
              : (t.lanes = 1073741824)
            : (t.lanes = 1),
          null)
        : ((u = r.children),
          (e = r.fallback),
          i
            ? ((r = t.mode),
              (i = t.child),
              (u = { mode: "hidden", children: u }),
              !(r & 1) && i !== null
                ? ((i.childLanes = 0), (i.pendingProps = u))
                : (i = Tl(u, r, 0, null)),
              (e = $t(e, r, n, null)),
              (i.return = t),
              (e.return = t),
              (i.sibling = e),
              (t.child = i),
              (t.child.memoizedState = Ki(n)),
              (t.memoizedState = Qi),
              e)
            : Uu(t, u))
    );
  if (((l = e.memoizedState), l !== null && ((o = l.dehydrated), o !== null)))
    return Od(e, t, u, r, o, l, n);
  if (i) {
    ((i = r.fallback), (u = t.mode), (l = e.child), (o = l.sibling));
    var s = { mode: "hidden", children: r.children };
    return (
      !(u & 1) && t.child !== l
        ? ((r = t.child),
          (r.childLanes = 0),
          (r.pendingProps = s),
          (t.deletions = null))
        : ((r = Nt(l, s)), (r.subtreeFlags = l.subtreeFlags & 14680064)),
      o !== null ? (i = Nt(o, i)) : ((i = $t(i, u, n, null)), (i.flags |= 2)),
      (i.return = t),
      (r.return = t),
      (r.sibling = i),
      (t.child = r),
      (r = i),
      (i = t.child),
      (u = e.child.memoizedState),
      (u =
        u === null
          ? Ki(n)
          : {
              baseLanes: u.baseLanes | n,
              cachePool: null,
              transitions: u.transitions,
            }),
      (i.memoizedState = u),
      (i.childLanes = e.childLanes & ~n),
      (t.memoizedState = Qi),
      r
    );
  }
  return (
    (i = e.child),
    (e = i.sibling),
    (r = Nt(i, { mode: "visible", children: r.children })),
    !(t.mode & 1) && (r.lanes = n),
    (r.return = t),
    (r.sibling = null),
    e !== null &&
      ((n = t.deletions),
      n === null ? ((t.deletions = [e]), (t.flags |= 16)) : n.push(e)),
    (t.child = r),
    (t.memoizedState = null),
    r
  );
}
function Uu(e, t) {
  return (
    (t = Tl({ mode: "visible", children: t }, e.mode, 0, null)),
    (t.return = e),
    (e.child = t)
  );
}
function Lr(e, t, n, r) {
  return (
    r !== null && Nu(r),
    yn(t, e.child, null, n),
    (e = Uu(t, t.pendingProps.children)),
    (e.flags |= 2),
    (t.memoizedState = null),
    e
  );
}
function Od(e, t, n, r, l, i, u) {
  if (n)
    return t.flags & 256
      ? ((t.flags &= -257), (r = li(Error(y(422)))), Lr(e, t, u, r))
      : t.memoizedState !== null
        ? ((t.child = e.child), (t.flags |= 128), null)
        : ((i = r.fallback),
          (l = t.mode),
          (r = Tl({ mode: "visible", children: r.children }, l, 0, null)),
          (i = $t(i, l, u, null)),
          (i.flags |= 2),
          (r.return = t),
          (i.return = t),
          (r.sibling = i),
          (t.child = r),
          t.mode & 1 && yn(t, e.child, null, u),
          (t.child.memoizedState = Ki(u)),
          (t.memoizedState = Qi),
          i);
  if (!(t.mode & 1)) return Lr(e, t, u, null);
  if (l.data === "$!") {
    if (((r = l.nextSibling && l.nextSibling.dataset), r)) var o = r.dgst;
    return (
      (r = o),
      (i = Error(y(419))),
      (r = li(i, r, void 0)),
      Lr(e, t, u, r)
    );
  }
  if (((o = (u & e.childLanes) !== 0), ge || o)) {
    if (((r = le), r !== null)) {
      switch (u & -u) {
        case 4:
          l = 2;
          break;
        case 16:
          l = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          l = 32;
          break;
        case 536870912:
          l = 268435456;
          break;
        default:
          l = 0;
      }
      ((l = l & (r.suspendedLanes | u) ? 0 : l),
        l !== 0 &&
          l !== i.retryLane &&
          ((i.retryLane = l), ut(e, l), Ve(r, e, l, -1)));
    }
    return (Qu(), (r = li(Error(y(421)))), Lr(e, t, u, r));
  }
  return l.data === "$?"
    ? ((t.flags |= 128),
      (t.child = e.child),
      (t = Xd.bind(null, e)),
      (l._reactRetry = t),
      null)
    : ((e = i.treeContext),
      (Ce = St(l.nextSibling)),
      (Ne = t),
      (K = !0),
      (Ue = null),
      e !== null &&
        ((je[Le++] = tt),
        (je[Le++] = nt),
        (je[Le++] = At),
        (tt = e.id),
        (nt = e.overflow),
        (At = t)),
      (t = Uu(t, r.children)),
      (t.flags |= 4096),
      t);
}
function bo(e, t, n) {
  e.lanes |= t;
  var r = e.alternate;
  (r !== null && (r.lanes |= t), Ui(e.return, t, n));
}
function ii(e, t, n, r, l) {
  var i = e.memoizedState;
  i === null
    ? (e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: r,
        tail: n,
        tailMode: l,
      })
    : ((i.isBackwards = t),
      (i.rendering = null),
      (i.renderingStartTime = 0),
      (i.last = r),
      (i.tail = n),
      (i.tailMode = l));
}
function lc(e, t, n) {
  var r = t.pendingProps,
    l = r.revealOrder,
    i = r.tail;
  if ((de(e, t, r.children, n), (r = Y.current), r & 2))
    ((r = (r & 1) | 2), (t.flags |= 128));
  else {
    if (e !== null && e.flags & 128)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && bo(e, n, t);
        else if (e.tag === 19) bo(e, n, t);
        else if (e.child !== null) {
          ((e.child.return = e), (e = e.child));
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) break e;
          e = e.return;
        }
        ((e.sibling.return = e.return), (e = e.sibling));
      }
    r &= 1;
  }
  if ((A(Y, r), !(t.mode & 1))) t.memoizedState = null;
  else
    switch (l) {
      case "forwards":
        for (n = t.child, l = null; n !== null; )
          ((e = n.alternate),
            e !== null && cl(e) === null && (l = n),
            (n = n.sibling));
        ((n = l),
          n === null
            ? ((l = t.child), (t.child = null))
            : ((l = n.sibling), (n.sibling = null)),
          ii(t, !1, l, n, i));
        break;
      case "backwards":
        for (n = null, l = t.child, t.child = null; l !== null; ) {
          if (((e = l.alternate), e !== null && cl(e) === null)) {
            t.child = l;
            break;
          }
          ((e = l.sibling), (l.sibling = n), (n = l), (l = e));
        }
        ii(t, !0, n, null, i);
        break;
      case "together":
        ii(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
  return t.child;
}
function Hr(e, t) {
  !(t.mode & 1) &&
    e !== null &&
    ((e.alternate = null), (t.alternate = null), (t.flags |= 2));
}
function ot(e, t, n) {
  if (
    (e !== null && (t.dependencies = e.dependencies),
    (Bt |= t.lanes),
    !(n & t.childLanes))
  )
    return null;
  if (e !== null && t.child !== e.child) throw Error(y(153));
  if (t.child !== null) {
    for (
      e = t.child, n = Nt(e, e.pendingProps), t.child = n, n.return = t;
      e.sibling !== null;
    )
      ((e = e.sibling),
        (n = n.sibling = Nt(e, e.pendingProps)),
        (n.return = t));
    n.sibling = null;
  }
  return t.child;
}
function Id(e, t, n) {
  switch (t.tag) {
    case 3:
      (nc(t), gn());
      break;
    case 5:
      ja(t);
      break;
    case 1:
      we(t.type) && ll(t);
      break;
    case 4:
      Lu(t, t.stateNode.containerInfo);
      break;
    case 10:
      var r = t.type._context,
        l = t.memoizedProps.value;
      (A(ol, r._currentValue), (r._currentValue = l));
      break;
    case 13:
      if (((r = t.memoizedState), r !== null))
        return r.dehydrated !== null
          ? (A(Y, Y.current & 1), (t.flags |= 128), null)
          : n & t.child.childLanes
            ? rc(e, t, n)
            : (A(Y, Y.current & 1),
              (e = ot(e, t, n)),
              e !== null ? e.sibling : null);
      A(Y, Y.current & 1);
      break;
    case 19:
      if (((r = (n & t.childLanes) !== 0), e.flags & 128)) {
        if (r) return lc(e, t, n);
        t.flags |= 128;
      }
      if (
        ((l = t.memoizedState),
        l !== null &&
          ((l.rendering = null), (l.tail = null), (l.lastEffect = null)),
        A(Y, Y.current),
        r)
      )
        break;
      return null;
    case 22:
    case 23:
      return ((t.lanes = 0), ec(e, t, n));
  }
  return ot(e, t, n);
}
var ic, Xi, uc, oc;
ic = function (e, t) {
  for (var n = t.child; n !== null; ) {
    if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode);
    else if (n.tag !== 4 && n.child !== null) {
      ((n.child.return = n), (n = n.child));
      continue;
    }
    if (n === t) break;
    for (; n.sibling === null; ) {
      if (n.return === null || n.return === t) return;
      n = n.return;
    }
    ((n.sibling.return = n.return), (n = n.sibling));
  }
};
Xi = function () {};
uc = function (e, t, n, r) {
  var l = e.memoizedProps;
  if (l !== r) {
    ((e = t.stateNode), It(Ge.current));
    var i = null;
    switch (n) {
      case "input":
        ((l = mi(e, l)), (r = mi(e, r)), (i = []));
        break;
      case "select":
        ((l = Z({}, l, { value: void 0 })),
          (r = Z({}, r, { value: void 0 })),
          (i = []));
        break;
      case "textarea":
        ((l = yi(e, l)), (r = yi(e, r)), (i = []));
        break;
      default:
        typeof l.onClick != "function" &&
          typeof r.onClick == "function" &&
          (e.onclick = nl);
    }
    ki(n, r);
    var u;
    n = null;
    for (c in l)
      if (!r.hasOwnProperty(c) && l.hasOwnProperty(c) && l[c] != null)
        if (c === "style") {
          var o = l[c];
          for (u in o) o.hasOwnProperty(u) && (n || (n = {}), (n[u] = ""));
        } else
          c !== "dangerouslySetInnerHTML" &&
            c !== "children" &&
            c !== "suppressContentEditableWarning" &&
            c !== "suppressHydrationWarning" &&
            c !== "autoFocus" &&
            (Xn.hasOwnProperty(c)
              ? i || (i = [])
              : (i = i || []).push(c, null));
    for (c in r) {
      var s = r[c];
      if (
        ((o = l != null ? l[c] : void 0),
        r.hasOwnProperty(c) && s !== o && (s != null || o != null))
      )
        if (c === "style")
          if (o) {
            for (u in o)
              !o.hasOwnProperty(u) ||
                (s && s.hasOwnProperty(u)) ||
                (n || (n = {}), (n[u] = ""));
            for (u in s)
              s.hasOwnProperty(u) &&
                o[u] !== s[u] &&
                (n || (n = {}), (n[u] = s[u]));
          } else (n || (i || (i = []), i.push(c, n)), (n = s));
        else
          c === "dangerouslySetInnerHTML"
            ? ((s = s ? s.__html : void 0),
              (o = o ? o.__html : void 0),
              s != null && o !== s && (i = i || []).push(c, s))
            : c === "children"
              ? (typeof s != "string" && typeof s != "number") ||
                (i = i || []).push(c, "" + s)
              : c !== "suppressContentEditableWarning" &&
                c !== "suppressHydrationWarning" &&
                (Xn.hasOwnProperty(c)
                  ? (s != null && c === "onScroll" && H("scroll", e),
                    i || o === s || (i = []))
                  : (i = i || []).push(c, s));
    }
    n && (i = i || []).push("style", n);
    var c = i;
    (t.updateQueue = c) && (t.flags |= 4);
  }
};
oc = function (e, t, n, r) {
  n !== r && (t.flags |= 4);
};
function Rn(e, t) {
  if (!K)
    switch (e.tailMode) {
      case "hidden":
        t = e.tail;
        for (var n = null; t !== null; )
          (t.alternate !== null && (n = t), (t = t.sibling));
        n === null ? (e.tail = null) : (n.sibling = null);
        break;
      case "collapsed":
        n = e.tail;
        for (var r = null; n !== null; )
          (n.alternate !== null && (r = n), (n = n.sibling));
        r === null
          ? t || e.tail === null
            ? (e.tail = null)
            : (e.tail.sibling = null)
          : (r.sibling = null);
    }
}
function ae(e) {
  var t = e.alternate !== null && e.alternate.child === e.child,
    n = 0,
    r = 0;
  if (t)
    for (var l = e.child; l !== null; )
      ((n |= l.lanes | l.childLanes),
        (r |= l.subtreeFlags & 14680064),
        (r |= l.flags & 14680064),
        (l.return = e),
        (l = l.sibling));
  else
    for (l = e.child; l !== null; )
      ((n |= l.lanes | l.childLanes),
        (r |= l.subtreeFlags),
        (r |= l.flags),
        (l.return = e),
        (l = l.sibling));
  return ((e.subtreeFlags |= r), (e.childLanes = n), t);
}
function Dd(e, t, n) {
  var r = t.pendingProps;
  switch ((Cu(t), t.tag)) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return (ae(t), null);
    case 1:
      return (we(t.type) && rl(), ae(t), null);
    case 3:
      return (
        (r = t.stateNode),
        wn(),
        W(ye),
        W(fe),
        Mu(),
        r.pendingContext &&
          ((r.context = r.pendingContext), (r.pendingContext = null)),
        (e === null || e.child === null) &&
          (Tr(t)
            ? (t.flags |= 4)
            : e === null ||
              (e.memoizedState.isDehydrated && !(t.flags & 256)) ||
              ((t.flags |= 1024), Ue !== null && (tu(Ue), (Ue = null)))),
        Xi(e, t),
        ae(t),
        null
      );
    case 5:
      Ru(t);
      var l = It(ir.current);
      if (((n = t.type), e !== null && t.stateNode != null))
        (uc(e, t, n, r, l),
          e.ref !== t.ref && ((t.flags |= 512), (t.flags |= 2097152)));
      else {
        if (!r) {
          if (t.stateNode === null) throw Error(y(166));
          return (ae(t), null);
        }
        if (((e = It(Ge.current)), Tr(t))) {
          ((r = t.stateNode), (n = t.type));
          var i = t.memoizedProps;
          switch (((r[Xe] = t), (r[rr] = i), (e = (t.mode & 1) !== 0), n)) {
            case "dialog":
              (H("cancel", r), H("close", r));
              break;
            case "iframe":
            case "object":
            case "embed":
              H("load", r);
              break;
            case "video":
            case "audio":
              for (l = 0; l < Fn.length; l++) H(Fn[l], r);
              break;
            case "source":
              H("error", r);
              break;
            case "img":
            case "image":
            case "link":
              (H("error", r), H("load", r));
              break;
            case "details":
              H("toggle", r);
              break;
            case "input":
              (oo(r, i), H("invalid", r));
              break;
            case "select":
              ((r._wrapperState = { wasMultiple: !!i.multiple }),
                H("invalid", r));
              break;
            case "textarea":
              (ao(r, i), H("invalid", r));
          }
          (ki(n, i), (l = null));
          for (var u in i)
            if (i.hasOwnProperty(u)) {
              var o = i[u];
              u === "children"
                ? typeof o == "string"
                  ? r.textContent !== o &&
                    (i.suppressHydrationWarning !== !0 &&
                      zr(r.textContent, o, e),
                    (l = ["children", o]))
                  : typeof o == "number" &&
                    r.textContent !== "" + o &&
                    (i.suppressHydrationWarning !== !0 &&
                      zr(r.textContent, o, e),
                    (l = ["children", "" + o]))
                : Xn.hasOwnProperty(u) &&
                  o != null &&
                  u === "onScroll" &&
                  H("scroll", r);
            }
          switch (n) {
            case "input":
              (kr(r), so(r, i, !0));
              break;
            case "textarea":
              (kr(r), co(r));
              break;
            case "select":
            case "option":
              break;
            default:
              typeof i.onClick == "function" && (r.onclick = nl);
          }
          ((r = l), (t.updateQueue = r), r !== null && (t.flags |= 4));
        } else {
          ((u = l.nodeType === 9 ? l : l.ownerDocument),
            e === "http://www.w3.org/1999/xhtml" && (e = Is(n)),
            e === "http://www.w3.org/1999/xhtml"
              ? n === "script"
                ? ((e = u.createElement("div")),
                  (e.innerHTML = "<script><\/script>"),
                  (e = e.removeChild(e.firstChild)))
                : typeof r.is == "string"
                  ? (e = u.createElement(n, { is: r.is }))
                  : ((e = u.createElement(n)),
                    n === "select" &&
                      ((u = e),
                      r.multiple
                        ? (u.multiple = !0)
                        : r.size && (u.size = r.size)))
              : (e = u.createElementNS(e, n)),
            (e[Xe] = t),
            (e[rr] = r),
            ic(e, t, !1, !1),
            (t.stateNode = e));
          e: {
            switch (((u = Si(n, r)), n)) {
              case "dialog":
                (H("cancel", e), H("close", e), (l = r));
                break;
              case "iframe":
              case "object":
              case "embed":
                (H("load", e), (l = r));
                break;
              case "video":
              case "audio":
                for (l = 0; l < Fn.length; l++) H(Fn[l], e);
                l = r;
                break;
              case "source":
                (H("error", e), (l = r));
                break;
              case "img":
              case "image":
              case "link":
                (H("error", e), H("load", e), (l = r));
                break;
              case "details":
                (H("toggle", e), (l = r));
                break;
              case "input":
                (oo(e, r), (l = mi(e, r)), H("invalid", e));
                break;
              case "option":
                l = r;
                break;
              case "select":
                ((e._wrapperState = { wasMultiple: !!r.multiple }),
                  (l = Z({}, r, { value: void 0 })),
                  H("invalid", e));
                break;
              case "textarea":
                (ao(e, r), (l = yi(e, r)), H("invalid", e));
                break;
              default:
                l = r;
            }
            (ki(n, l), (o = l));
            for (i in o)
              if (o.hasOwnProperty(i)) {
                var s = o[i];
                i === "style"
                  ? $s(e, s)
                  : i === "dangerouslySetInnerHTML"
                    ? ((s = s ? s.__html : void 0), s != null && Ds(e, s))
                    : i === "children"
                      ? typeof s == "string"
                        ? (n !== "textarea" || s !== "") && Yn(e, s)
                        : typeof s == "number" && Yn(e, "" + s)
                      : i !== "suppressContentEditableWarning" &&
                        i !== "suppressHydrationWarning" &&
                        i !== "autoFocus" &&
                        (Xn.hasOwnProperty(i)
                          ? s != null && i === "onScroll" && H("scroll", e)
                          : s != null && au(e, i, s, u));
              }
            switch (n) {
              case "input":
                (kr(e), so(e, r, !1));
                break;
              case "textarea":
                (kr(e), co(e));
                break;
              case "option":
                r.value != null && e.setAttribute("value", "" + _t(r.value));
                break;
              case "select":
                ((e.multiple = !!r.multiple),
                  (i = r.value),
                  i != null
                    ? an(e, !!r.multiple, i, !1)
                    : r.defaultValue != null &&
                      an(e, !!r.multiple, r.defaultValue, !0));
                break;
              default:
                typeof l.onClick == "function" && (e.onclick = nl);
            }
            switch (n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                r = !!r.autoFocus;
                break e;
              case "img":
                r = !0;
                break e;
              default:
                r = !1;
            }
          }
          r && (t.flags |= 4);
        }
        t.ref !== null && ((t.flags |= 512), (t.flags |= 2097152));
      }
      return (ae(t), null);
    case 6:
      if (e && t.stateNode != null) oc(e, t, e.memoizedProps, r);
      else {
        if (typeof r != "string" && t.stateNode === null) throw Error(y(166));
        if (((n = It(ir.current)), It(Ge.current), Tr(t))) {
          if (
            ((r = t.stateNode),
            (n = t.memoizedProps),
            (r[Xe] = t),
            (i = r.nodeValue !== n) && ((e = Ne), e !== null))
          )
            switch (e.tag) {
              case 3:
                zr(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 &&
                  zr(r.nodeValue, n, (e.mode & 1) !== 0);
            }
          i && (t.flags |= 4);
        } else
          ((r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r)),
            (r[Xe] = t),
            (t.stateNode = r));
      }
      return (ae(t), null);
    case 13:
      if (
        (W(Y),
        (r = t.memoizedState),
        e === null ||
          (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
      ) {
        if (K && Ce !== null && t.mode & 1 && !(t.flags & 128))
          (Na(), gn(), (t.flags |= 98560), (i = !1));
        else if (((i = Tr(t)), r !== null && r.dehydrated !== null)) {
          if (e === null) {
            if (!i) throw Error(y(318));
            if (
              ((i = t.memoizedState),
              (i = i !== null ? i.dehydrated : null),
              !i)
            )
              throw Error(y(317));
            i[Xe] = t;
          } else
            (gn(),
              !(t.flags & 128) && (t.memoizedState = null),
              (t.flags |= 4));
          (ae(t), (i = !1));
        } else (Ue !== null && (tu(Ue), (Ue = null)), (i = !0));
        if (!i) return t.flags & 65536 ? t : null;
      }
      return t.flags & 128
        ? ((t.lanes = n), t)
        : ((r = r !== null),
          r !== (e !== null && e.memoizedState !== null) &&
            r &&
            ((t.child.flags |= 8192),
            t.mode & 1 &&
              (e === null || Y.current & 1 ? ne === 0 && (ne = 3) : Qu())),
          t.updateQueue !== null && (t.flags |= 4),
          ae(t),
          null);
    case 4:
      return (
        wn(),
        Xi(e, t),
        e === null && tr(t.stateNode.containerInfo),
        ae(t),
        null
      );
    case 10:
      return (zu(t.type._context), ae(t), null);
    case 17:
      return (we(t.type) && rl(), ae(t), null);
    case 19:
      if ((W(Y), (i = t.memoizedState), i === null)) return (ae(t), null);
      if (((r = (t.flags & 128) !== 0), (u = i.rendering), u === null))
        if (r) Rn(i, !1);
        else {
          if (ne !== 0 || (e !== null && e.flags & 128))
            for (e = t.child; e !== null; ) {
              if (((u = cl(e)), u !== null)) {
                for (
                  t.flags |= 128,
                    Rn(i, !1),
                    r = u.updateQueue,
                    r !== null && ((t.updateQueue = r), (t.flags |= 4)),
                    t.subtreeFlags = 0,
                    r = n,
                    n = t.child;
                  n !== null;
                )
                  ((i = n),
                    (e = r),
                    (i.flags &= 14680066),
                    (u = i.alternate),
                    u === null
                      ? ((i.childLanes = 0),
                        (i.lanes = e),
                        (i.child = null),
                        (i.subtreeFlags = 0),
                        (i.memoizedProps = null),
                        (i.memoizedState = null),
                        (i.updateQueue = null),
                        (i.dependencies = null),
                        (i.stateNode = null))
                      : ((i.childLanes = u.childLanes),
                        (i.lanes = u.lanes),
                        (i.child = u.child),
                        (i.subtreeFlags = 0),
                        (i.deletions = null),
                        (i.memoizedProps = u.memoizedProps),
                        (i.memoizedState = u.memoizedState),
                        (i.updateQueue = u.updateQueue),
                        (i.type = u.type),
                        (e = u.dependencies),
                        (i.dependencies =
                          e === null
                            ? null
                            : {
                                lanes: e.lanes,
                                firstContext: e.firstContext,
                              })),
                    (n = n.sibling));
                return (A(Y, (Y.current & 1) | 2), t.child);
              }
              e = e.sibling;
            }
          i.tail !== null &&
            q() > Sn &&
            ((t.flags |= 128), (r = !0), Rn(i, !1), (t.lanes = 4194304));
        }
      else {
        if (!r)
          if (((e = cl(u)), e !== null)) {
            if (
              ((t.flags |= 128),
              (r = !0),
              (n = e.updateQueue),
              n !== null && ((t.updateQueue = n), (t.flags |= 4)),
              Rn(i, !0),
              i.tail === null && i.tailMode === "hidden" && !u.alternate && !K)
            )
              return (ae(t), null);
          } else
            2 * q() - i.renderingStartTime > Sn &&
              n !== 1073741824 &&
              ((t.flags |= 128), (r = !0), Rn(i, !1), (t.lanes = 4194304));
        i.isBackwards
          ? ((u.sibling = t.child), (t.child = u))
          : ((n = i.last),
            n !== null ? (n.sibling = u) : (t.child = u),
            (i.last = u));
      }
      return i.tail !== null
        ? ((t = i.tail),
          (i.rendering = t),
          (i.tail = t.sibling),
          (i.renderingStartTime = q()),
          (t.sibling = null),
          (n = Y.current),
          A(Y, r ? (n & 1) | 2 : n & 1),
          t)
        : (ae(t), null);
    case 22:
    case 23:
      return (
        Wu(),
        (r = t.memoizedState !== null),
        e !== null && (e.memoizedState !== null) !== r && (t.flags |= 8192),
        r && t.mode & 1
          ? Ee & 1073741824 && (ae(t), t.subtreeFlags & 6 && (t.flags |= 8192))
          : ae(t),
        null
      );
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(y(156, t.tag));
}
function Fd(e, t) {
  switch ((Cu(t), t.tag)) {
    case 1:
      return (
        we(t.type) && rl(),
        (e = t.flags),
        e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 3:
      return (
        wn(),
        W(ye),
        W(fe),
        Mu(),
        (e = t.flags),
        e & 65536 && !(e & 128) ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 5:
      return (Ru(t), null);
    case 13:
      if ((W(Y), (e = t.memoizedState), e !== null && e.dehydrated !== null)) {
        if (t.alternate === null) throw Error(y(340));
        gn();
      }
      return (
        (e = t.flags),
        e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 19:
      return (W(Y), null);
    case 4:
      return (wn(), null);
    case 10:
      return (zu(t.type._context), null);
    case 22:
    case 23:
      return (Wu(), null);
    case 24:
      return null;
    default:
      return null;
  }
}
var Rr = !1,
  ce = !1,
  $d = typeof WeakSet == "function" ? WeakSet : Set,
  N = null;
function un(e, t) {
  var n = e.ref;
  if (n !== null)
    if (typeof n == "function")
      try {
        n(null);
      } catch (r) {
        J(e, t, r);
      }
    else n.current = null;
}
function Yi(e, t, n) {
  try {
    n();
  } catch (r) {
    J(e, t, r);
  }
}
var es = !1;
function Ud(e, t) {
  if (((Li = br), (e = da()), xu(e))) {
    if ("selectionStart" in e)
      var n = { start: e.selectionStart, end: e.selectionEnd };
    else
      e: {
        n = ((n = e.ownerDocument) && n.defaultView) || window;
        var r = n.getSelection && n.getSelection();
        if (r && r.rangeCount !== 0) {
          n = r.anchorNode;
          var l = r.anchorOffset,
            i = r.focusNode;
          r = r.focusOffset;
          try {
            (n.nodeType, i.nodeType);
          } catch {
            n = null;
            break e;
          }
          var u = 0,
            o = -1,
            s = -1,
            c = 0,
            m = 0,
            h = e,
            p = null;
          t: for (;;) {
            for (
              var k;
              h !== n || (l !== 0 && h.nodeType !== 3) || (o = u + l),
                h !== i || (r !== 0 && h.nodeType !== 3) || (s = u + r),
                h.nodeType === 3 && (u += h.nodeValue.length),
                (k = h.firstChild) !== null;
            )
              ((p = h), (h = k));
            for (;;) {
              if (h === e) break t;
              if (
                (p === n && ++c === l && (o = u),
                p === i && ++m === r && (s = u),
                (k = h.nextSibling) !== null)
              )
                break;
              ((h = p), (p = h.parentNode));
            }
            h = k;
          }
          n = o === -1 || s === -1 ? null : { start: o, end: s };
        } else n = null;
      }
    n = n || { start: 0, end: 0 };
  } else n = null;
  for (Ri = { focusedElem: e, selectionRange: n }, br = !1, N = t; N !== null; )
    if (((t = N), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null))
      ((e.return = t), (N = e));
    else
      for (; N !== null; ) {
        t = N;
        try {
          var S = t.alternate;
          if (t.flags & 1024)
            switch (t.tag) {
              case 0:
              case 11:
              case 15:
                break;
              case 1:
                if (S !== null) {
                  var x = S.memoizedProps,
                    L = S.memoizedState,
                    f = t.stateNode,
                    a = f.getSnapshotBeforeUpdate(
                      t.elementType === t.type ? x : Fe(t.type, x),
                      L,
                    );
                  f.__reactInternalSnapshotBeforeUpdate = a;
                }
                break;
              case 3:
                var d = t.stateNode.containerInfo;
                d.nodeType === 1
                  ? (d.textContent = "")
                  : d.nodeType === 9 &&
                    d.documentElement &&
                    d.removeChild(d.documentElement);
                break;
              case 5:
              case 6:
              case 4:
              case 17:
                break;
              default:
                throw Error(y(163));
            }
        } catch (v) {
          J(t, t.return, v);
        }
        if (((e = t.sibling), e !== null)) {
          ((e.return = t.return), (N = e));
          break;
        }
        N = t.return;
      }
  return ((S = es), (es = !1), S);
}
function Wn(e, t, n) {
  var r = t.updateQueue;
  if (((r = r !== null ? r.lastEffect : null), r !== null)) {
    var l = (r = r.next);
    do {
      if ((l.tag & e) === e) {
        var i = l.destroy;
        ((l.destroy = void 0), i !== void 0 && Yi(t, n, i));
      }
      l = l.next;
    } while (l !== r);
  }
}
function Pl(e, t) {
  if (
    ((t = t.updateQueue), (t = t !== null ? t.lastEffect : null), t !== null)
  ) {
    var n = (t = t.next);
    do {
      if ((n.tag & e) === e) {
        var r = n.create;
        n.destroy = r();
      }
      n = n.next;
    } while (n !== t);
  }
}
function Gi(e) {
  var t = e.ref;
  if (t !== null) {
    var n = e.stateNode;
    switch (e.tag) {
      case 5:
        e = n;
        break;
      default:
        e = n;
    }
    typeof t == "function" ? t(e) : (t.current = e);
  }
}
function sc(e) {
  var t = e.alternate;
  (t !== null && ((e.alternate = null), sc(t)),
    (e.child = null),
    (e.deletions = null),
    (e.sibling = null),
    e.tag === 5 &&
      ((t = e.stateNode),
      t !== null &&
        (delete t[Xe], delete t[rr], delete t[Ii], delete t[Sd], delete t[xd])),
    (e.stateNode = null),
    (e.return = null),
    (e.dependencies = null),
    (e.memoizedProps = null),
    (e.memoizedState = null),
    (e.pendingProps = null),
    (e.stateNode = null),
    (e.updateQueue = null));
}
function ac(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function ts(e) {
  e: for (;;) {
    for (; e.sibling === null; ) {
      if (e.return === null || ac(e.return)) return null;
      e = e.return;
    }
    for (
      e.sibling.return = e.return, e = e.sibling;
      e.tag !== 5 && e.tag !== 6 && e.tag !== 18;
    ) {
      if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
      ((e.child.return = e), (e = e.child));
    }
    if (!(e.flags & 2)) return e.stateNode;
  }
}
function Zi(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6)
    ((e = e.stateNode),
      t
        ? n.nodeType === 8
          ? n.parentNode.insertBefore(e, t)
          : n.insertBefore(e, t)
        : (n.nodeType === 8
            ? ((t = n.parentNode), t.insertBefore(e, n))
            : ((t = n), t.appendChild(e)),
          (n = n._reactRootContainer),
          n != null || t.onclick !== null || (t.onclick = nl)));
  else if (r !== 4 && ((e = e.child), e !== null))
    for (Zi(e, t, n), e = e.sibling; e !== null; )
      (Zi(e, t, n), (e = e.sibling));
}
function Ji(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6)
    ((e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e));
  else if (r !== 4 && ((e = e.child), e !== null))
    for (Ji(e, t, n), e = e.sibling; e !== null; )
      (Ji(e, t, n), (e = e.sibling));
}
var ie = null,
  $e = !1;
function ft(e, t, n) {
  for (n = n.child; n !== null; ) (cc(e, t, n), (n = n.sibling));
}
function cc(e, t, n) {
  if (Ye && typeof Ye.onCommitFiberUnmount == "function")
    try {
      Ye.onCommitFiberUnmount(wl, n);
    } catch {}
  switch (n.tag) {
    case 5:
      ce || un(n, t);
    case 6:
      var r = ie,
        l = $e;
      ((ie = null),
        ft(e, t, n),
        (ie = r),
        ($e = l),
        ie !== null &&
          ($e
            ? ((e = ie),
              (n = n.stateNode),
              e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n))
            : ie.removeChild(n.stateNode)));
      break;
    case 18:
      ie !== null &&
        ($e
          ? ((e = ie),
            (n = n.stateNode),
            e.nodeType === 8
              ? ql(e.parentNode, n)
              : e.nodeType === 1 && ql(e, n),
            qn(e))
          : ql(ie, n.stateNode));
      break;
    case 4:
      ((r = ie),
        (l = $e),
        (ie = n.stateNode.containerInfo),
        ($e = !0),
        ft(e, t, n),
        (ie = r),
        ($e = l));
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (
        !ce &&
        ((r = n.updateQueue), r !== null && ((r = r.lastEffect), r !== null))
      ) {
        l = r = r.next;
        do {
          var i = l,
            u = i.destroy;
          ((i = i.tag),
            u !== void 0 && (i & 2 || i & 4) && Yi(n, t, u),
            (l = l.next));
        } while (l !== r);
      }
      ft(e, t, n);
      break;
    case 1:
      if (
        !ce &&
        (un(n, t),
        (r = n.stateNode),
        typeof r.componentWillUnmount == "function")
      )
        try {
          ((r.props = n.memoizedProps),
            (r.state = n.memoizedState),
            r.componentWillUnmount());
        } catch (o) {
          J(n, t, o);
        }
      ft(e, t, n);
      break;
    case 21:
      ft(e, t, n);
      break;
    case 22:
      n.mode & 1
        ? ((ce = (r = ce) || n.memoizedState !== null), ft(e, t, n), (ce = r))
        : ft(e, t, n);
      break;
    default:
      ft(e, t, n);
  }
}
function ns(e) {
  var t = e.updateQueue;
  if (t !== null) {
    e.updateQueue = null;
    var n = e.stateNode;
    (n === null && (n = e.stateNode = new $d()),
      t.forEach(function (r) {
        var l = Yd.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(l, l));
      }));
  }
}
function De(e, t) {
  var n = t.deletions;
  if (n !== null)
    for (var r = 0; r < n.length; r++) {
      var l = n[r];
      try {
        var i = e,
          u = t,
          o = u;
        e: for (; o !== null; ) {
          switch (o.tag) {
            case 5:
              ((ie = o.stateNode), ($e = !1));
              break e;
            case 3:
              ((ie = o.stateNode.containerInfo), ($e = !0));
              break e;
            case 4:
              ((ie = o.stateNode.containerInfo), ($e = !0));
              break e;
          }
          o = o.return;
        }
        if (ie === null) throw Error(y(160));
        (cc(i, u, l), (ie = null), ($e = !1));
        var s = l.alternate;
        (s !== null && (s.return = null), (l.return = null));
      } catch (c) {
        J(l, t, c);
      }
    }
  if (t.subtreeFlags & 12854)
    for (t = t.child; t !== null; ) (fc(t, e), (t = t.sibling));
}
function fc(e, t) {
  var n = e.alternate,
    r = e.flags;
  switch (e.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if ((De(t, e), Qe(e), r & 4)) {
        try {
          (Wn(3, e, e.return), Pl(3, e));
        } catch (x) {
          J(e, e.return, x);
        }
        try {
          Wn(5, e, e.return);
        } catch (x) {
          J(e, e.return, x);
        }
      }
      break;
    case 1:
      (De(t, e), Qe(e), r & 512 && n !== null && un(n, n.return));
      break;
    case 5:
      if (
        (De(t, e),
        Qe(e),
        r & 512 && n !== null && un(n, n.return),
        e.flags & 32)
      ) {
        var l = e.stateNode;
        try {
          Yn(l, "");
        } catch (x) {
          J(e, e.return, x);
        }
      }
      if (r & 4 && ((l = e.stateNode), l != null)) {
        var i = e.memoizedProps,
          u = n !== null ? n.memoizedProps : i,
          o = e.type,
          s = e.updateQueue;
        if (((e.updateQueue = null), s !== null))
          try {
            (o === "input" && i.type === "radio" && i.name != null && Ms(l, i),
              Si(o, u));
            var c = Si(o, i);
            for (u = 0; u < s.length; u += 2) {
              var m = s[u],
                h = s[u + 1];
              m === "style"
                ? $s(l, h)
                : m === "dangerouslySetInnerHTML"
                  ? Ds(l, h)
                  : m === "children"
                    ? Yn(l, h)
                    : au(l, m, h, c);
            }
            switch (o) {
              case "input":
                vi(l, i);
                break;
              case "textarea":
                Os(l, i);
                break;
              case "select":
                var p = l._wrapperState.wasMultiple;
                l._wrapperState.wasMultiple = !!i.multiple;
                var k = i.value;
                k != null
                  ? an(l, !!i.multiple, k, !1)
                  : p !== !!i.multiple &&
                    (i.defaultValue != null
                      ? an(l, !!i.multiple, i.defaultValue, !0)
                      : an(l, !!i.multiple, i.multiple ? [] : "", !1));
            }
            l[rr] = i;
          } catch (x) {
            J(e, e.return, x);
          }
      }
      break;
    case 6:
      if ((De(t, e), Qe(e), r & 4)) {
        if (e.stateNode === null) throw Error(y(162));
        ((l = e.stateNode), (i = e.memoizedProps));
        try {
          l.nodeValue = i;
        } catch (x) {
          J(e, e.return, x);
        }
      }
      break;
    case 3:
      if (
        (De(t, e), Qe(e), r & 4 && n !== null && n.memoizedState.isDehydrated)
      )
        try {
          qn(t.containerInfo);
        } catch (x) {
          J(e, e.return, x);
        }
      break;
    case 4:
      (De(t, e), Qe(e));
      break;
    case 13:
      (De(t, e),
        Qe(e),
        (l = e.child),
        l.flags & 8192 &&
          ((i = l.memoizedState !== null),
          (l.stateNode.isHidden = i),
          !i ||
            (l.alternate !== null && l.alternate.memoizedState !== null) ||
            (Bu = q())),
        r & 4 && ns(e));
      break;
    case 22:
      if (
        ((m = n !== null && n.memoizedState !== null),
        e.mode & 1 ? ((ce = (c = ce) || m), De(t, e), (ce = c)) : De(t, e),
        Qe(e),
        r & 8192)
      ) {
        if (
          ((c = e.memoizedState !== null),
          (e.stateNode.isHidden = c) && !m && e.mode & 1)
        )
          for (N = e, m = e.child; m !== null; ) {
            for (h = N = m; N !== null; ) {
              switch (((p = N), (k = p.child), p.tag)) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Wn(4, p, p.return);
                  break;
                case 1:
                  un(p, p.return);
                  var S = p.stateNode;
                  if (typeof S.componentWillUnmount == "function") {
                    ((r = p), (n = p.return));
                    try {
                      ((t = r),
                        (S.props = t.memoizedProps),
                        (S.state = t.memoizedState),
                        S.componentWillUnmount());
                    } catch (x) {
                      J(r, n, x);
                    }
                  }
                  break;
                case 5:
                  un(p, p.return);
                  break;
                case 22:
                  if (p.memoizedState !== null) {
                    ls(h);
                    continue;
                  }
              }
              k !== null ? ((k.return = p), (N = k)) : ls(h);
            }
            m = m.sibling;
          }
        e: for (m = null, h = e; ; ) {
          if (h.tag === 5) {
            if (m === null) {
              m = h;
              try {
                ((l = h.stateNode),
                  c
                    ? ((i = l.style),
                      typeof i.setProperty == "function"
                        ? i.setProperty("display", "none", "important")
                        : (i.display = "none"))
                    : ((o = h.stateNode),
                      (s = h.memoizedProps.style),
                      (u =
                        s != null && s.hasOwnProperty("display")
                          ? s.display
                          : null),
                      (o.style.display = Fs("display", u))));
              } catch (x) {
                J(e, e.return, x);
              }
            }
          } else if (h.tag === 6) {
            if (m === null)
              try {
                h.stateNode.nodeValue = c ? "" : h.memoizedProps;
              } catch (x) {
                J(e, e.return, x);
              }
          } else if (
            ((h.tag !== 22 && h.tag !== 23) ||
              h.memoizedState === null ||
              h === e) &&
            h.child !== null
          ) {
            ((h.child.return = h), (h = h.child));
            continue;
          }
          if (h === e) break e;
          for (; h.sibling === null; ) {
            if (h.return === null || h.return === e) break e;
            (m === h && (m = null), (h = h.return));
          }
          (m === h && (m = null),
            (h.sibling.return = h.return),
            (h = h.sibling));
        }
      }
      break;
    case 19:
      (De(t, e), Qe(e), r & 4 && ns(e));
      break;
    case 21:
      break;
    default:
      (De(t, e), Qe(e));
  }
}
function Qe(e) {
  var t = e.flags;
  if (t & 2) {
    try {
      e: {
        for (var n = e.return; n !== null; ) {
          if (ac(n)) {
            var r = n;
            break e;
          }
          n = n.return;
        }
        throw Error(y(160));
      }
      switch (r.tag) {
        case 5:
          var l = r.stateNode;
          r.flags & 32 && (Yn(l, ""), (r.flags &= -33));
          var i = ts(e);
          Ji(e, i, l);
          break;
        case 3:
        case 4:
          var u = r.stateNode.containerInfo,
            o = ts(e);
          Zi(e, o, u);
          break;
        default:
          throw Error(y(161));
      }
    } catch (s) {
      J(e, e.return, s);
    }
    e.flags &= -3;
  }
  t & 4096 && (e.flags &= -4097);
}
function Ad(e, t, n) {
  ((N = e), dc(e));
}
function dc(e, t, n) {
  for (var r = (e.mode & 1) !== 0; N !== null; ) {
    var l = N,
      i = l.child;
    if (l.tag === 22 && r) {
      var u = l.memoizedState !== null || Rr;
      if (!u) {
        var o = l.alternate,
          s = (o !== null && o.memoizedState !== null) || ce;
        o = Rr;
        var c = ce;
        if (((Rr = u), (ce = s) && !c))
          for (N = l; N !== null; )
            ((u = N),
              (s = u.child),
              u.tag === 22 && u.memoizedState !== null
                ? is(l)
                : s !== null
                  ? ((s.return = u), (N = s))
                  : is(l));
        for (; i !== null; ) ((N = i), dc(i), (i = i.sibling));
        ((N = l), (Rr = o), (ce = c));
      }
      rs(e);
    } else
      l.subtreeFlags & 8772 && i !== null ? ((i.return = l), (N = i)) : rs(e);
  }
}
function rs(e) {
  for (; N !== null; ) {
    var t = N;
    if (t.flags & 8772) {
      var n = t.alternate;
      try {
        if (t.flags & 8772)
          switch (t.tag) {
            case 0:
            case 11:
            case 15:
              ce || Pl(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !ce)
                if (n === null) r.componentDidMount();
                else {
                  var l =
                    t.elementType === t.type
                      ? n.memoizedProps
                      : Fe(t.type, n.memoizedProps);
                  r.componentDidUpdate(
                    l,
                    n.memoizedState,
                    r.__reactInternalSnapshotBeforeUpdate,
                  );
                }
              var i = t.updateQueue;
              i !== null && Vo(t, i, r);
              break;
            case 3:
              var u = t.updateQueue;
              if (u !== null) {
                if (((n = null), t.child !== null))
                  switch (t.child.tag) {
                    case 5:
                      n = t.child.stateNode;
                      break;
                    case 1:
                      n = t.child.stateNode;
                  }
                Vo(t, u, n);
              }
              break;
            case 5:
              var o = t.stateNode;
              if (n === null && t.flags & 4) {
                n = o;
                var s = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    s.autoFocus && n.focus();
                    break;
                  case "img":
                    s.src && (n.src = s.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (t.memoizedState === null) {
                var c = t.alternate;
                if (c !== null) {
                  var m = c.memoizedState;
                  if (m !== null) {
                    var h = m.dehydrated;
                    h !== null && qn(h);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(y(163));
          }
        ce || (t.flags & 512 && Gi(t));
      } catch (p) {
        J(t, t.return, p);
      }
    }
    if (t === e) {
      N = null;
      break;
    }
    if (((n = t.sibling), n !== null)) {
      ((n.return = t.return), (N = n));
      break;
    }
    N = t.return;
  }
}
function ls(e) {
  for (; N !== null; ) {
    var t = N;
    if (t === e) {
      N = null;
      break;
    }
    var n = t.sibling;
    if (n !== null) {
      ((n.return = t.return), (N = n));
      break;
    }
    N = t.return;
  }
}
function is(e) {
  for (; N !== null; ) {
    var t = N;
    try {
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          var n = t.return;
          try {
            Pl(4, t);
          } catch (s) {
            J(t, n, s);
          }
          break;
        case 1:
          var r = t.stateNode;
          if (typeof r.componentDidMount == "function") {
            var l = t.return;
            try {
              r.componentDidMount();
            } catch (s) {
              J(t, l, s);
            }
          }
          var i = t.return;
          try {
            Gi(t);
          } catch (s) {
            J(t, i, s);
          }
          break;
        case 5:
          var u = t.return;
          try {
            Gi(t);
          } catch (s) {
            J(t, u, s);
          }
      }
    } catch (s) {
      J(t, t.return, s);
    }
    if (t === e) {
      N = null;
      break;
    }
    var o = t.sibling;
    if (o !== null) {
      ((o.return = t.return), (N = o));
      break;
    }
    N = t.return;
  }
}
var Vd = Math.ceil,
  pl = st.ReactCurrentDispatcher,
  Au = st.ReactCurrentOwner,
  Me = st.ReactCurrentBatchConfig,
  $ = 0,
  le = null,
  ee = null,
  ue = 0,
  Ee = 0,
  on = Tt(0),
  ne = 0,
  ar = null,
  Bt = 0,
  zl = 0,
  Vu = 0,
  Qn = null,
  ve = null,
  Bu = 0,
  Sn = 1 / 0,
  be = null,
  hl = !1,
  qi = null,
  Et = null,
  Mr = !1,
  gt = null,
  ml = 0,
  Kn = 0,
  bi = null,
  Wr = -1,
  Qr = 0;
function pe() {
  return $ & 6 ? q() : Wr !== -1 ? Wr : (Wr = q());
}
function Ct(e) {
  return e.mode & 1
    ? $ & 2 && ue !== 0
      ? ue & -ue
      : Cd.transition !== null
        ? (Qr === 0 && (Qr = Zs()), Qr)
        : ((e = U),
          e !== 0 || ((e = window.event), (e = e === void 0 ? 16 : ra(e.type))),
          e)
    : 1;
}
function Ve(e, t, n, r) {
  if (50 < Kn) throw ((Kn = 0), (bi = null), Error(y(185)));
  (fr(e, n, r),
    (!($ & 2) || e !== le) &&
      (e === le && (!($ & 2) && (zl |= n), ne === 4 && mt(e, ue)),
      ke(e, r),
      n === 1 && $ === 0 && !(t.mode & 1) && ((Sn = q() + 500), Cl && jt())));
}
function ke(e, t) {
  var n = e.callbackNode;
  Cf(e, t);
  var r = qr(e, e === le ? ue : 0);
  if (r === 0)
    (n !== null && ho(n), (e.callbackNode = null), (e.callbackPriority = 0));
  else if (((t = r & -r), e.callbackPriority !== t)) {
    if ((n != null && ho(n), t === 1))
      (e.tag === 0 ? Ed(us.bind(null, e)) : xa(us.bind(null, e)),
        wd(function () {
          !($ & 6) && jt();
        }),
        (n = null));
    else {
      switch (Js(r)) {
        case 1:
          n = hu;
          break;
        case 4:
          n = Ys;
          break;
        case 16:
          n = Jr;
          break;
        case 536870912:
          n = Gs;
          break;
        default:
          n = Jr;
      }
      n = kc(n, pc.bind(null, e));
    }
    ((e.callbackPriority = t), (e.callbackNode = n));
  }
}
function pc(e, t) {
  if (((Wr = -1), (Qr = 0), $ & 6)) throw Error(y(327));
  var n = e.callbackNode;
  if (hn() && e.callbackNode !== n) return null;
  var r = qr(e, e === le ? ue : 0);
  if (r === 0) return null;
  if (r & 30 || r & e.expiredLanes || t) t = vl(e, r);
  else {
    t = r;
    var l = $;
    $ |= 2;
    var i = mc();
    (le !== e || ue !== t) && ((be = null), (Sn = q() + 500), Ft(e, t));
    do
      try {
        Wd();
        break;
      } catch (o) {
        hc(e, o);
      }
    while (!0);
    (Pu(),
      (pl.current = i),
      ($ = l),
      ee !== null ? (t = 0) : ((le = null), (ue = 0), (t = ne)));
  }
  if (t !== 0) {
    if (
      (t === 2 && ((l = _i(e)), l !== 0 && ((r = l), (t = eu(e, l)))), t === 1)
    )
      throw ((n = ar), Ft(e, 0), mt(e, r), ke(e, q()), n);
    if (t === 6) mt(e, r);
    else {
      if (
        ((l = e.current.alternate),
        !(r & 30) &&
          !Bd(l) &&
          ((t = vl(e, r)),
          t === 2 && ((i = _i(e)), i !== 0 && ((r = i), (t = eu(e, i)))),
          t === 1))
      )
        throw ((n = ar), Ft(e, 0), mt(e, r), ke(e, q()), n);
      switch (((e.finishedWork = l), (e.finishedLanes = r), t)) {
        case 0:
        case 1:
          throw Error(y(345));
        case 2:
          Rt(e, ve, be);
          break;
        case 3:
          if (
            (mt(e, r), (r & 130023424) === r && ((t = Bu + 500 - q()), 10 < t))
          ) {
            if (qr(e, 0) !== 0) break;
            if (((l = e.suspendedLanes), (l & r) !== r)) {
              (pe(), (e.pingedLanes |= e.suspendedLanes & l));
              break;
            }
            e.timeoutHandle = Oi(Rt.bind(null, e, ve, be), t);
            break;
          }
          Rt(e, ve, be);
          break;
        case 4:
          if ((mt(e, r), (r & 4194240) === r)) break;
          for (t = e.eventTimes, l = -1; 0 < r; ) {
            var u = 31 - Ae(r);
            ((i = 1 << u), (u = t[u]), u > l && (l = u), (r &= ~i));
          }
          if (
            ((r = l),
            (r = q() - r),
            (r =
              (120 > r
                ? 120
                : 480 > r
                  ? 480
                  : 1080 > r
                    ? 1080
                    : 1920 > r
                      ? 1920
                      : 3e3 > r
                        ? 3e3
                        : 4320 > r
                          ? 4320
                          : 1960 * Vd(r / 1960)) - r),
            10 < r)
          ) {
            e.timeoutHandle = Oi(Rt.bind(null, e, ve, be), r);
            break;
          }
          Rt(e, ve, be);
          break;
        case 5:
          Rt(e, ve, be);
          break;
        default:
          throw Error(y(329));
      }
    }
  }
  return (ke(e, q()), e.callbackNode === n ? pc.bind(null, e) : null);
}
function eu(e, t) {
  var n = Qn;
  return (
    e.current.memoizedState.isDehydrated && (Ft(e, t).flags |= 256),
    (e = vl(e, t)),
    e !== 2 && ((t = ve), (ve = n), t !== null && tu(t)),
    e
  );
}
function tu(e) {
  ve === null ? (ve = e) : ve.push.apply(ve, e);
}
function Bd(e) {
  for (var t = e; ; ) {
    if (t.flags & 16384) {
      var n = t.updateQueue;
      if (n !== null && ((n = n.stores), n !== null))
        for (var r = 0; r < n.length; r++) {
          var l = n[r],
            i = l.getSnapshot;
          l = l.value;
          try {
            if (!Be(i(), l)) return !1;
          } catch {
            return !1;
          }
        }
    }
    if (((n = t.child), t.subtreeFlags & 16384 && n !== null))
      ((n.return = t), (t = n));
    else {
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return !0;
        t = t.return;
      }
      ((t.sibling.return = t.return), (t = t.sibling));
    }
  }
  return !0;
}
function mt(e, t) {
  for (
    t &= ~Vu,
      t &= ~zl,
      e.suspendedLanes |= t,
      e.pingedLanes &= ~t,
      e = e.expirationTimes;
    0 < t;
  ) {
    var n = 31 - Ae(t),
      r = 1 << n;
    ((e[n] = -1), (t &= ~r));
  }
}
function us(e) {
  if ($ & 6) throw Error(y(327));
  hn();
  var t = qr(e, 0);
  if (!(t & 1)) return (ke(e, q()), null);
  var n = vl(e, t);
  if (e.tag !== 0 && n === 2) {
    var r = _i(e);
    r !== 0 && ((t = r), (n = eu(e, r)));
  }
  if (n === 1) throw ((n = ar), Ft(e, 0), mt(e, t), ke(e, q()), n);
  if (n === 6) throw Error(y(345));
  return (
    (e.finishedWork = e.current.alternate),
    (e.finishedLanes = t),
    Rt(e, ve, be),
    ke(e, q()),
    null
  );
}
function Hu(e, t) {
  var n = $;
  $ |= 1;
  try {
    return e(t);
  } finally {
    (($ = n), $ === 0 && ((Sn = q() + 500), Cl && jt()));
  }
}
function Ht(e) {
  gt !== null && gt.tag === 0 && !($ & 6) && hn();
  var t = $;
  $ |= 1;
  var n = Me.transition,
    r = U;
  try {
    if (((Me.transition = null), (U = 1), e)) return e();
  } finally {
    ((U = r), (Me.transition = n), ($ = t), !($ & 6) && jt());
  }
}
function Wu() {
  ((Ee = on.current), W(on));
}
function Ft(e, t) {
  ((e.finishedWork = null), (e.finishedLanes = 0));
  var n = e.timeoutHandle;
  if ((n !== -1 && ((e.timeoutHandle = -1), yd(n)), ee !== null))
    for (n = ee.return; n !== null; ) {
      var r = n;
      switch ((Cu(r), r.tag)) {
        case 1:
          ((r = r.type.childContextTypes), r != null && rl());
          break;
        case 3:
          (wn(), W(ye), W(fe), Mu());
          break;
        case 5:
          Ru(r);
          break;
        case 4:
          wn();
          break;
        case 13:
          W(Y);
          break;
        case 19:
          W(Y);
          break;
        case 10:
          zu(r.type._context);
          break;
        case 22:
        case 23:
          Wu();
      }
      n = n.return;
    }
  if (
    ((le = e),
    (ee = e = Nt(e.current, null)),
    (ue = Ee = t),
    (ne = 0),
    (ar = null),
    (Vu = zl = Bt = 0),
    (ve = Qn = null),
    Ot !== null)
  ) {
    for (t = 0; t < Ot.length; t++)
      if (((n = Ot[t]), (r = n.interleaved), r !== null)) {
        n.interleaved = null;
        var l = r.next,
          i = n.pending;
        if (i !== null) {
          var u = i.next;
          ((i.next = l), (r.next = u));
        }
        n.pending = r;
      }
    Ot = null;
  }
  return e;
}
function hc(e, t) {
  do {
    var n = ee;
    try {
      if ((Pu(), (Vr.current = dl), fl)) {
        for (var r = G.memoizedState; r !== null; ) {
          var l = r.queue;
          (l !== null && (l.pending = null), (r = r.next));
        }
        fl = !1;
      }
      if (
        ((Vt = 0),
        (re = te = G = null),
        (Hn = !1),
        (ur = 0),
        (Au.current = null),
        n === null || n.return === null)
      ) {
        ((ne = 1), (ar = t), (ee = null));
        break;
      }
      e: {
        var i = e,
          u = n.return,
          o = n,
          s = t;
        if (
          ((t = ue),
          (o.flags |= 32768),
          s !== null && typeof s == "object" && typeof s.then == "function")
        ) {
          var c = s,
            m = o,
            h = m.tag;
          if (!(m.mode & 1) && (h === 0 || h === 11 || h === 15)) {
            var p = m.alternate;
            p
              ? ((m.updateQueue = p.updateQueue),
                (m.memoizedState = p.memoizedState),
                (m.lanes = p.lanes))
              : ((m.updateQueue = null), (m.memoizedState = null));
          }
          var k = Xo(u);
          if (k !== null) {
            ((k.flags &= -257),
              Yo(k, u, o, i, t),
              k.mode & 1 && Ko(i, c, t),
              (t = k),
              (s = c));
            var S = t.updateQueue;
            if (S === null) {
              var x = new Set();
              (x.add(s), (t.updateQueue = x));
            } else S.add(s);
            break e;
          } else {
            if (!(t & 1)) {
              (Ko(i, c, t), Qu());
              break e;
            }
            s = Error(y(426));
          }
        } else if (K && o.mode & 1) {
          var L = Xo(u);
          if (L !== null) {
            (!(L.flags & 65536) && (L.flags |= 256),
              Yo(L, u, o, i, t),
              Nu(kn(s, o)));
            break e;
          }
        }
        ((i = s = kn(s, o)),
          ne !== 4 && (ne = 2),
          Qn === null ? (Qn = [i]) : Qn.push(i),
          (i = u));
        do {
          switch (i.tag) {
            case 3:
              ((i.flags |= 65536), (t &= -t), (i.lanes |= t));
              var f = Ja(i, s, t);
              Ao(i, f);
              break e;
            case 1:
              o = s;
              var a = i.type,
                d = i.stateNode;
              if (
                !(i.flags & 128) &&
                (typeof a.getDerivedStateFromError == "function" ||
                  (d !== null &&
                    typeof d.componentDidCatch == "function" &&
                    (Et === null || !Et.has(d))))
              ) {
                ((i.flags |= 65536), (t &= -t), (i.lanes |= t));
                var v = qa(i, o, t);
                Ao(i, v);
                break e;
              }
          }
          i = i.return;
        } while (i !== null);
      }
      gc(n);
    } catch (E) {
      ((t = E), ee === n && n !== null && (ee = n = n.return));
      continue;
    }
    break;
  } while (!0);
}
function mc() {
  var e = pl.current;
  return ((pl.current = dl), e === null ? dl : e);
}
function Qu() {
  ((ne === 0 || ne === 3 || ne === 2) && (ne = 4),
    le === null || (!(Bt & 268435455) && !(zl & 268435455)) || mt(le, ue));
}
function vl(e, t) {
  var n = $;
  $ |= 2;
  var r = mc();
  (le !== e || ue !== t) && ((be = null), Ft(e, t));
  do
    try {
      Hd();
      break;
    } catch (l) {
      hc(e, l);
    }
  while (!0);
  if ((Pu(), ($ = n), (pl.current = r), ee !== null)) throw Error(y(261));
  return ((le = null), (ue = 0), ne);
}
function Hd() {
  for (; ee !== null; ) vc(ee);
}
function Wd() {
  for (; ee !== null && !mf(); ) vc(ee);
}
function vc(e) {
  var t = wc(e.alternate, e, Ee);
  ((e.memoizedProps = e.pendingProps),
    t === null ? gc(e) : (ee = t),
    (Au.current = null));
}
function gc(e) {
  var t = e;
  do {
    var n = t.alternate;
    if (((e = t.return), t.flags & 32768)) {
      if (((n = Fd(n, t)), n !== null)) {
        ((n.flags &= 32767), (ee = n));
        return;
      }
      if (e !== null)
        ((e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null));
      else {
        ((ne = 6), (ee = null));
        return;
      }
    } else if (((n = Dd(n, t, Ee)), n !== null)) {
      ee = n;
      return;
    }
    if (((t = t.sibling), t !== null)) {
      ee = t;
      return;
    }
    ee = t = e;
  } while (t !== null);
  ne === 0 && (ne = 5);
}
function Rt(e, t, n) {
  var r = U,
    l = Me.transition;
  try {
    ((Me.transition = null), (U = 1), Qd(e, t, n, r));
  } finally {
    ((Me.transition = l), (U = r));
  }
  return null;
}
function Qd(e, t, n, r) {
  do hn();
  while (gt !== null);
  if ($ & 6) throw Error(y(327));
  n = e.finishedWork;
  var l = e.finishedLanes;
  if (n === null) return null;
  if (((e.finishedWork = null), (e.finishedLanes = 0), n === e.current))
    throw Error(y(177));
  ((e.callbackNode = null), (e.callbackPriority = 0));
  var i = n.lanes | n.childLanes;
  if (
    (Nf(e, i),
    e === le && ((ee = le = null), (ue = 0)),
    (!(n.subtreeFlags & 2064) && !(n.flags & 2064)) ||
      Mr ||
      ((Mr = !0),
      kc(Jr, function () {
        return (hn(), null);
      })),
    (i = (n.flags & 15990) !== 0),
    n.subtreeFlags & 15990 || i)
  ) {
    ((i = Me.transition), (Me.transition = null));
    var u = U;
    U = 1;
    var o = $;
    (($ |= 4),
      (Au.current = null),
      Ud(e, n),
      fc(n, e),
      fd(Ri),
      (br = !!Li),
      (Ri = Li = null),
      (e.current = n),
      Ad(n),
      vf(),
      ($ = o),
      (U = u),
      (Me.transition = i));
  } else e.current = n;
  if (
    (Mr && ((Mr = !1), (gt = e), (ml = l)),
    (i = e.pendingLanes),
    i === 0 && (Et = null),
    wf(n.stateNode),
    ke(e, q()),
    t !== null)
  )
    for (r = e.onRecoverableError, n = 0; n < t.length; n++)
      ((l = t[n]), r(l.value, { componentStack: l.stack, digest: l.digest }));
  if (hl) throw ((hl = !1), (e = qi), (qi = null), e);
  return (
    ml & 1 && e.tag !== 0 && hn(),
    (i = e.pendingLanes),
    i & 1 ? (e === bi ? Kn++ : ((Kn = 0), (bi = e))) : (Kn = 0),
    jt(),
    null
  );
}
function hn() {
  if (gt !== null) {
    var e = Js(ml),
      t = Me.transition,
      n = U;
    try {
      if (((Me.transition = null), (U = 16 > e ? 16 : e), gt === null))
        var r = !1;
      else {
        if (((e = gt), (gt = null), (ml = 0), $ & 6)) throw Error(y(331));
        var l = $;
        for ($ |= 4, N = e.current; N !== null; ) {
          var i = N,
            u = i.child;
          if (N.flags & 16) {
            var o = i.deletions;
            if (o !== null) {
              for (var s = 0; s < o.length; s++) {
                var c = o[s];
                for (N = c; N !== null; ) {
                  var m = N;
                  switch (m.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Wn(8, m, i);
                  }
                  var h = m.child;
                  if (h !== null) ((h.return = m), (N = h));
                  else
                    for (; N !== null; ) {
                      m = N;
                      var p = m.sibling,
                        k = m.return;
                      if ((sc(m), m === c)) {
                        N = null;
                        break;
                      }
                      if (p !== null) {
                        ((p.return = k), (N = p));
                        break;
                      }
                      N = k;
                    }
                }
              }
              var S = i.alternate;
              if (S !== null) {
                var x = S.child;
                if (x !== null) {
                  S.child = null;
                  do {
                    var L = x.sibling;
                    ((x.sibling = null), (x = L));
                  } while (x !== null);
                }
              }
              N = i;
            }
          }
          if (i.subtreeFlags & 2064 && u !== null) ((u.return = i), (N = u));
          else
            e: for (; N !== null; ) {
              if (((i = N), i.flags & 2048))
                switch (i.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Wn(9, i, i.return);
                }
              var f = i.sibling;
              if (f !== null) {
                ((f.return = i.return), (N = f));
                break e;
              }
              N = i.return;
            }
        }
        var a = e.current;
        for (N = a; N !== null; ) {
          u = N;
          var d = u.child;
          if (u.subtreeFlags & 2064 && d !== null) ((d.return = u), (N = d));
          else
            e: for (u = a; N !== null; ) {
              if (((o = N), o.flags & 2048))
                try {
                  switch (o.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Pl(9, o);
                  }
                } catch (E) {
                  J(o, o.return, E);
                }
              if (o === u) {
                N = null;
                break e;
              }
              var v = o.sibling;
              if (v !== null) {
                ((v.return = o.return), (N = v));
                break e;
              }
              N = o.return;
            }
        }
        if (
          (($ = l), jt(), Ye && typeof Ye.onPostCommitFiberRoot == "function")
        )
          try {
            Ye.onPostCommitFiberRoot(wl, e);
          } catch {}
        r = !0;
      }
      return r;
    } finally {
      ((U = n), (Me.transition = t));
    }
  }
  return !1;
}
function os(e, t, n) {
  ((t = kn(n, t)),
    (t = Ja(e, t, 1)),
    (e = xt(e, t, 1)),
    (t = pe()),
    e !== null && (fr(e, 1, t), ke(e, t)));
}
function J(e, t, n) {
  if (e.tag === 3) os(e, e, n);
  else
    for (; t !== null; ) {
      if (t.tag === 3) {
        os(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (
          typeof t.type.getDerivedStateFromError == "function" ||
          (typeof r.componentDidCatch == "function" &&
            (Et === null || !Et.has(r)))
        ) {
          ((e = kn(n, e)),
            (e = qa(t, e, 1)),
            (t = xt(t, e, 1)),
            (e = pe()),
            t !== null && (fr(t, 1, e), ke(t, e)));
          break;
        }
      }
      t = t.return;
    }
}
function Kd(e, t, n) {
  var r = e.pingCache;
  (r !== null && r.delete(t),
    (t = pe()),
    (e.pingedLanes |= e.suspendedLanes & n),
    le === e &&
      (ue & n) === n &&
      (ne === 4 || (ne === 3 && (ue & 130023424) === ue && 500 > q() - Bu)
        ? Ft(e, 0)
        : (Vu |= n)),
    ke(e, t));
}
function yc(e, t) {
  t === 0 &&
    (e.mode & 1
      ? ((t = Er), (Er <<= 1), !(Er & 130023424) && (Er = 4194304))
      : (t = 1));
  var n = pe();
  ((e = ut(e, t)), e !== null && (fr(e, t, n), ke(e, n)));
}
function Xd(e) {
  var t = e.memoizedState,
    n = 0;
  (t !== null && (n = t.retryLane), yc(e, n));
}
function Yd(e, t) {
  var n = 0;
  switch (e.tag) {
    case 13:
      var r = e.stateNode,
        l = e.memoizedState;
      l !== null && (n = l.retryLane);
      break;
    case 19:
      r = e.stateNode;
      break;
    default:
      throw Error(y(314));
  }
  (r !== null && r.delete(t), yc(e, n));
}
var wc;
wc = function (e, t, n) {
  if (e !== null)
    if (e.memoizedProps !== t.pendingProps || ye.current) ge = !0;
    else {
      if (!(e.lanes & n) && !(t.flags & 128)) return ((ge = !1), Id(e, t, n));
      ge = !!(e.flags & 131072);
    }
  else ((ge = !1), K && t.flags & 1048576 && Ea(t, ul, t.index));
  switch (((t.lanes = 0), t.tag)) {
    case 2:
      var r = t.type;
      (Hr(e, t), (e = t.pendingProps));
      var l = vn(t, fe.current);
      (pn(t, n), (l = Iu(null, t, r, e, l, n)));
      var i = Du();
      return (
        (t.flags |= 1),
        typeof l == "object" &&
        l !== null &&
        typeof l.render == "function" &&
        l.$$typeof === void 0
          ? ((t.tag = 1),
            (t.memoizedState = null),
            (t.updateQueue = null),
            we(r) ? ((i = !0), ll(t)) : (i = !1),
            (t.memoizedState =
              l.state !== null && l.state !== void 0 ? l.state : null),
            ju(t),
            (l.updater = _l),
            (t.stateNode = l),
            (l._reactInternals = t),
            Vi(t, r, e, n),
            (t = Wi(null, t, r, !0, i, n)))
          : ((t.tag = 0), K && i && Eu(t), de(null, t, l, n), (t = t.child)),
        t
      );
    case 16:
      r = t.elementType;
      e: {
        switch (
          (Hr(e, t),
          (e = t.pendingProps),
          (l = r._init),
          (r = l(r._payload)),
          (t.type = r),
          (l = t.tag = Zd(r)),
          (e = Fe(r, e)),
          l)
        ) {
          case 0:
            t = Hi(null, t, r, e, n);
            break e;
          case 1:
            t = Jo(null, t, r, e, n);
            break e;
          case 11:
            t = Go(null, t, r, e, n);
            break e;
          case 14:
            t = Zo(null, t, r, Fe(r.type, e), n);
            break e;
        }
        throw Error(y(306, r, ""));
      }
      return t;
    case 0:
      return (
        (r = t.type),
        (l = t.pendingProps),
        (l = t.elementType === r ? l : Fe(r, l)),
        Hi(e, t, r, l, n)
      );
    case 1:
      return (
        (r = t.type),
        (l = t.pendingProps),
        (l = t.elementType === r ? l : Fe(r, l)),
        Jo(e, t, r, l, n)
      );
    case 3:
      e: {
        if ((nc(t), e === null)) throw Error(y(387));
        ((r = t.pendingProps),
          (i = t.memoizedState),
          (l = i.element),
          Ta(e, t),
          al(t, r, null, n));
        var u = t.memoizedState;
        if (((r = u.element), i.isDehydrated))
          if (
            ((i = {
              element: r,
              isDehydrated: !1,
              cache: u.cache,
              pendingSuspenseBoundaries: u.pendingSuspenseBoundaries,
              transitions: u.transitions,
            }),
            (t.updateQueue.baseState = i),
            (t.memoizedState = i),
            t.flags & 256)
          ) {
            ((l = kn(Error(y(423)), t)), (t = qo(e, t, r, n, l)));
            break e;
          } else if (r !== l) {
            ((l = kn(Error(y(424)), t)), (t = qo(e, t, r, n, l)));
            break e;
          } else
            for (
              Ce = St(t.stateNode.containerInfo.firstChild),
                Ne = t,
                K = !0,
                Ue = null,
                n = Pa(t, null, r, n),
                t.child = n;
              n;
            )
              ((n.flags = (n.flags & -3) | 4096), (n = n.sibling));
        else {
          if ((gn(), r === l)) {
            t = ot(e, t, n);
            break e;
          }
          de(e, t, r, n);
        }
        t = t.child;
      }
      return t;
    case 5:
      return (
        ja(t),
        e === null && $i(t),
        (r = t.type),
        (l = t.pendingProps),
        (i = e !== null ? e.memoizedProps : null),
        (u = l.children),
        Mi(r, l) ? (u = null) : i !== null && Mi(r, i) && (t.flags |= 32),
        tc(e, t),
        de(e, t, u, n),
        t.child
      );
    case 6:
      return (e === null && $i(t), null);
    case 13:
      return rc(e, t, n);
    case 4:
      return (
        Lu(t, t.stateNode.containerInfo),
        (r = t.pendingProps),
        e === null ? (t.child = yn(t, null, r, n)) : de(e, t, r, n),
        t.child
      );
    case 11:
      return (
        (r = t.type),
        (l = t.pendingProps),
        (l = t.elementType === r ? l : Fe(r, l)),
        Go(e, t, r, l, n)
      );
    case 7:
      return (de(e, t, t.pendingProps, n), t.child);
    case 8:
      return (de(e, t, t.pendingProps.children, n), t.child);
    case 12:
      return (de(e, t, t.pendingProps.children, n), t.child);
    case 10:
      e: {
        if (
          ((r = t.type._context),
          (l = t.pendingProps),
          (i = t.memoizedProps),
          (u = l.value),
          A(ol, r._currentValue),
          (r._currentValue = u),
          i !== null)
        )
          if (Be(i.value, u)) {
            if (i.children === l.children && !ye.current) {
              t = ot(e, t, n);
              break e;
            }
          } else
            for (i = t.child, i !== null && (i.return = t); i !== null; ) {
              var o = i.dependencies;
              if (o !== null) {
                u = i.child;
                for (var s = o.firstContext; s !== null; ) {
                  if (s.context === r) {
                    if (i.tag === 1) {
                      ((s = rt(-1, n & -n)), (s.tag = 2));
                      var c = i.updateQueue;
                      if (c !== null) {
                        c = c.shared;
                        var m = c.pending;
                        (m === null
                          ? (s.next = s)
                          : ((s.next = m.next), (m.next = s)),
                          (c.pending = s));
                      }
                    }
                    ((i.lanes |= n),
                      (s = i.alternate),
                      s !== null && (s.lanes |= n),
                      Ui(i.return, n, t),
                      (o.lanes |= n));
                    break;
                  }
                  s = s.next;
                }
              } else if (i.tag === 10) u = i.type === t.type ? null : i.child;
              else if (i.tag === 18) {
                if (((u = i.return), u === null)) throw Error(y(341));
                ((u.lanes |= n),
                  (o = u.alternate),
                  o !== null && (o.lanes |= n),
                  Ui(u, n, t),
                  (u = i.sibling));
              } else u = i.child;
              if (u !== null) u.return = i;
              else
                for (u = i; u !== null; ) {
                  if (u === t) {
                    u = null;
                    break;
                  }
                  if (((i = u.sibling), i !== null)) {
                    ((i.return = u.return), (u = i));
                    break;
                  }
                  u = u.return;
                }
              i = u;
            }
        (de(e, t, l.children, n), (t = t.child));
      }
      return t;
    case 9:
      return (
        (l = t.type),
        (r = t.pendingProps.children),
        pn(t, n),
        (l = Oe(l)),
        (r = r(l)),
        (t.flags |= 1),
        de(e, t, r, n),
        t.child
      );
    case 14:
      return (
        (r = t.type),
        (l = Fe(r, t.pendingProps)),
        (l = Fe(r.type, l)),
        Zo(e, t, r, l, n)
      );
    case 15:
      return ba(e, t, t.type, t.pendingProps, n);
    case 17:
      return (
        (r = t.type),
        (l = t.pendingProps),
        (l = t.elementType === r ? l : Fe(r, l)),
        Hr(e, t),
        (t.tag = 1),
        we(r) ? ((e = !0), ll(t)) : (e = !1),
        pn(t, n),
        Za(t, r, l),
        Vi(t, r, l, n),
        Wi(null, t, r, !0, e, n)
      );
    case 19:
      return lc(e, t, n);
    case 22:
      return ec(e, t, n);
  }
  throw Error(y(156, t.tag));
};
function kc(e, t) {
  return Xs(e, t);
}
function Gd(e, t, n, r) {
  ((this.tag = e),
    (this.key = n),
    (this.sibling =
      this.child =
      this.return =
      this.stateNode =
      this.type =
      this.elementType =
        null),
    (this.index = 0),
    (this.ref = null),
    (this.pendingProps = t),
    (this.dependencies =
      this.memoizedState =
      this.updateQueue =
      this.memoizedProps =
        null),
    (this.mode = r),
    (this.subtreeFlags = this.flags = 0),
    (this.deletions = null),
    (this.childLanes = this.lanes = 0),
    (this.alternate = null));
}
function Re(e, t, n, r) {
  return new Gd(e, t, n, r);
}
function Ku(e) {
  return ((e = e.prototype), !(!e || !e.isReactComponent));
}
function Zd(e) {
  if (typeof e == "function") return Ku(e) ? 1 : 0;
  if (e != null) {
    if (((e = e.$$typeof), e === fu)) return 11;
    if (e === du) return 14;
  }
  return 2;
}
function Nt(e, t) {
  var n = e.alternate;
  return (
    n === null
      ? ((n = Re(e.tag, t, e.key, e.mode)),
        (n.elementType = e.elementType),
        (n.type = e.type),
        (n.stateNode = e.stateNode),
        (n.alternate = e),
        (e.alternate = n))
      : ((n.pendingProps = t),
        (n.type = e.type),
        (n.flags = 0),
        (n.subtreeFlags = 0),
        (n.deletions = null)),
    (n.flags = e.flags & 14680064),
    (n.childLanes = e.childLanes),
    (n.lanes = e.lanes),
    (n.child = e.child),
    (n.memoizedProps = e.memoizedProps),
    (n.memoizedState = e.memoizedState),
    (n.updateQueue = e.updateQueue),
    (t = e.dependencies),
    (n.dependencies =
      t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
    (n.sibling = e.sibling),
    (n.index = e.index),
    (n.ref = e.ref),
    n
  );
}
function Kr(e, t, n, r, l, i) {
  var u = 2;
  if (((r = e), typeof e == "function")) Ku(e) && (u = 1);
  else if (typeof e == "string") u = 5;
  else
    e: switch (e) {
      case Zt:
        return $t(n.children, l, i, t);
      case cu:
        ((u = 8), (l |= 8));
        break;
      case fi:
        return (
          (e = Re(12, n, t, l | 2)),
          (e.elementType = fi),
          (e.lanes = i),
          e
        );
      case di:
        return ((e = Re(13, n, t, l)), (e.elementType = di), (e.lanes = i), e);
      case pi:
        return ((e = Re(19, n, t, l)), (e.elementType = pi), (e.lanes = i), e);
      case js:
        return Tl(n, l, i, t);
      default:
        if (typeof e == "object" && e !== null)
          switch (e.$$typeof) {
            case zs:
              u = 10;
              break e;
            case Ts:
              u = 9;
              break e;
            case fu:
              u = 11;
              break e;
            case du:
              u = 14;
              break e;
            case dt:
              ((u = 16), (r = null));
              break e;
          }
        throw Error(y(130, e == null ? e : typeof e, ""));
    }
  return (
    (t = Re(u, n, t, l)),
    (t.elementType = e),
    (t.type = r),
    (t.lanes = i),
    t
  );
}
function $t(e, t, n, r) {
  return ((e = Re(7, e, r, t)), (e.lanes = n), e);
}
function Tl(e, t, n, r) {
  return (
    (e = Re(22, e, r, t)),
    (e.elementType = js),
    (e.lanes = n),
    (e.stateNode = { isHidden: !1 }),
    e
  );
}
function ui(e, t, n) {
  return ((e = Re(6, e, null, t)), (e.lanes = n), e);
}
function oi(e, t, n) {
  return (
    (t = Re(4, e.children !== null ? e.children : [], e.key, t)),
    (t.lanes = n),
    (t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation,
    }),
    t
  );
}
function Jd(e, t, n, r, l) {
  ((this.tag = t),
    (this.containerInfo = e),
    (this.finishedWork =
      this.pingCache =
      this.current =
      this.pendingChildren =
        null),
    (this.timeoutHandle = -1),
    (this.callbackNode = this.pendingContext = this.context = null),
    (this.callbackPriority = 0),
    (this.eventTimes = Vl(0)),
    (this.expirationTimes = Vl(-1)),
    (this.entangledLanes =
      this.finishedLanes =
      this.mutableReadLanes =
      this.expiredLanes =
      this.pingedLanes =
      this.suspendedLanes =
      this.pendingLanes =
        0),
    (this.entanglements = Vl(0)),
    (this.identifierPrefix = r),
    (this.onRecoverableError = l),
    (this.mutableSourceEagerHydrationData = null));
}
function Xu(e, t, n, r, l, i, u, o, s) {
  return (
    (e = new Jd(e, t, n, o, s)),
    t === 1 ? ((t = 1), i === !0 && (t |= 8)) : (t = 0),
    (i = Re(3, null, null, t)),
    (e.current = i),
    (i.stateNode = e),
    (i.memoizedState = {
      element: r,
      isDehydrated: n,
      cache: null,
      transitions: null,
      pendingSuspenseBoundaries: null,
    }),
    ju(i),
    e
  );
}
function qd(e, t, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return {
    $$typeof: Gt,
    key: r == null ? null : "" + r,
    children: e,
    containerInfo: t,
    implementation: n,
  };
}
function Sc(e) {
  if (!e) return Pt;
  e = e._reactInternals;
  e: {
    if (Qt(e) !== e || e.tag !== 1) throw Error(y(170));
    var t = e;
    do {
      switch (t.tag) {
        case 3:
          t = t.stateNode.context;
          break e;
        case 1:
          if (we(t.type)) {
            t = t.stateNode.__reactInternalMemoizedMergedChildContext;
            break e;
          }
      }
      t = t.return;
    } while (t !== null);
    throw Error(y(171));
  }
  if (e.tag === 1) {
    var n = e.type;
    if (we(n)) return Sa(e, n, t);
  }
  return t;
}
function xc(e, t, n, r, l, i, u, o, s) {
  return (
    (e = Xu(n, r, !0, e, l, i, u, o, s)),
    (e.context = Sc(null)),
    (n = e.current),
    (r = pe()),
    (l = Ct(n)),
    (i = rt(r, l)),
    (i.callback = t ?? null),
    xt(n, i, l),
    (e.current.lanes = l),
    fr(e, l, r),
    ke(e, r),
    e
  );
}
function jl(e, t, n, r) {
  var l = t.current,
    i = pe(),
    u = Ct(l);
  return (
    (n = Sc(n)),
    t.context === null ? (t.context = n) : (t.pendingContext = n),
    (t = rt(i, u)),
    (t.payload = { element: e }),
    (r = r === void 0 ? null : r),
    r !== null && (t.callback = r),
    (e = xt(l, t, u)),
    e !== null && (Ve(e, l, u, i), Ar(e, l, u)),
    u
  );
}
function gl(e) {
  if (((e = e.current), !e.child)) return null;
  switch (e.child.tag) {
    case 5:
      return e.child.stateNode;
    default:
      return e.child.stateNode;
  }
}
function ss(e, t) {
  if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
    var n = e.retryLane;
    e.retryLane = n !== 0 && n < t ? n : t;
  }
}
function Yu(e, t) {
  (ss(e, t), (e = e.alternate) && ss(e, t));
}
function bd() {
  return null;
}
var Ec =
  typeof reportError == "function"
    ? reportError
    : function (e) {
        console.error(e);
      };
function Gu(e) {
  this._internalRoot = e;
}
Ll.prototype.render = Gu.prototype.render = function (e) {
  var t = this._internalRoot;
  if (t === null) throw Error(y(409));
  jl(e, t, null, null);
};
Ll.prototype.unmount = Gu.prototype.unmount = function () {
  var e = this._internalRoot;
  if (e !== null) {
    this._internalRoot = null;
    var t = e.containerInfo;
    (Ht(function () {
      jl(null, e, null, null);
    }),
      (t[it] = null));
  }
};
function Ll(e) {
  this._internalRoot = e;
}
Ll.prototype.unstable_scheduleHydration = function (e) {
  if (e) {
    var t = ea();
    e = { blockedOn: null, target: e, priority: t };
    for (var n = 0; n < ht.length && t !== 0 && t < ht[n].priority; n++);
    (ht.splice(n, 0, e), n === 0 && na(e));
  }
};
function Zu(e) {
  return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
}
function Rl(e) {
  return !(
    !e ||
    (e.nodeType !== 1 &&
      e.nodeType !== 9 &&
      e.nodeType !== 11 &&
      (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "))
  );
}
function as() {}
function ep(e, t, n, r, l) {
  if (l) {
    if (typeof r == "function") {
      var i = r;
      r = function () {
        var c = gl(u);
        i.call(c);
      };
    }
    var u = xc(t, r, e, 0, null, !1, !1, "", as);
    return (
      (e._reactRootContainer = u),
      (e[it] = u.current),
      tr(e.nodeType === 8 ? e.parentNode : e),
      Ht(),
      u
    );
  }
  for (; (l = e.lastChild); ) e.removeChild(l);
  if (typeof r == "function") {
    var o = r;
    r = function () {
      var c = gl(s);
      o.call(c);
    };
  }
  var s = Xu(e, 0, !1, null, null, !1, !1, "", as);
  return (
    (e._reactRootContainer = s),
    (e[it] = s.current),
    tr(e.nodeType === 8 ? e.parentNode : e),
    Ht(function () {
      jl(t, s, n, r);
    }),
    s
  );
}
function Ml(e, t, n, r, l) {
  var i = n._reactRootContainer;
  if (i) {
    var u = i;
    if (typeof l == "function") {
      var o = l;
      l = function () {
        var s = gl(u);
        o.call(s);
      };
    }
    jl(t, u, e, l);
  } else u = ep(n, t, e, l, r);
  return gl(u);
}
qs = function (e) {
  switch (e.tag) {
    case 3:
      var t = e.stateNode;
      if (t.current.memoizedState.isDehydrated) {
        var n = Dn(t.pendingLanes);
        n !== 0 &&
          (mu(t, n | 1), ke(t, q()), !($ & 6) && ((Sn = q() + 500), jt()));
      }
      break;
    case 13:
      (Ht(function () {
        var r = ut(e, 1);
        if (r !== null) {
          var l = pe();
          Ve(r, e, 1, l);
        }
      }),
        Yu(e, 1));
  }
};
vu = function (e) {
  if (e.tag === 13) {
    var t = ut(e, 134217728);
    if (t !== null) {
      var n = pe();
      Ve(t, e, 134217728, n);
    }
    Yu(e, 134217728);
  }
};
bs = function (e) {
  if (e.tag === 13) {
    var t = Ct(e),
      n = ut(e, t);
    if (n !== null) {
      var r = pe();
      Ve(n, e, t, r);
    }
    Yu(e, t);
  }
};
ea = function () {
  return U;
};
ta = function (e, t) {
  var n = U;
  try {
    return ((U = e), t());
  } finally {
    U = n;
  }
};
Ei = function (e, t, n) {
  switch (t) {
    case "input":
      if ((vi(e, n), (t = n.name), n.type === "radio" && t != null)) {
        for (n = e; n.parentNode; ) n = n.parentNode;
        for (
          n = n.querySelectorAll(
            "input[name=" + JSON.stringify("" + t) + '][type="radio"]',
          ),
            t = 0;
          t < n.length;
          t++
        ) {
          var r = n[t];
          if (r !== e && r.form === e.form) {
            var l = El(r);
            if (!l) throw Error(y(90));
            (Rs(r), vi(r, l));
          }
        }
      }
      break;
    case "textarea":
      Os(e, n);
      break;
    case "select":
      ((t = n.value), t != null && an(e, !!n.multiple, t, !1));
  }
};
Vs = Hu;
Bs = Ht;
var tp = { usingClientEntryPoint: !1, Events: [pr, en, El, Us, As, Hu] },
  Mn = {
    findFiberByHostInstance: Mt,
    bundleType: 0,
    version: "18.3.1",
    rendererPackageName: "react-dom",
  },
  np = {
    bundleType: Mn.bundleType,
    version: Mn.version,
    rendererPackageName: Mn.rendererPackageName,
    rendererConfig: Mn.rendererConfig,
    overrideHookState: null,
    overrideHookStateDeletePath: null,
    overrideHookStateRenamePath: null,
    overrideProps: null,
    overridePropsDeletePath: null,
    overridePropsRenamePath: null,
    setErrorHandler: null,
    setSuspenseHandler: null,
    scheduleUpdate: null,
    currentDispatcherRef: st.ReactCurrentDispatcher,
    findHostInstanceByFiber: function (e) {
      return ((e = Qs(e)), e === null ? null : e.stateNode);
    },
    findFiberByHostInstance: Mn.findFiberByHostInstance || bd,
    findHostInstancesForRefresh: null,
    scheduleRefresh: null,
    scheduleRoot: null,
    setRefreshHandler: null,
    getCurrentFiber: null,
    reconcilerVersion: "18.3.1-next-f1338f8080-20240426",
  };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
  var Or = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!Or.isDisabled && Or.supportsFiber)
    try {
      ((wl = Or.inject(np)), (Ye = Or));
    } catch {}
}
Pe.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = tp;
Pe.createPortal = function (e, t) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!Zu(t)) throw Error(y(200));
  return qd(e, t, null, n);
};
Pe.createRoot = function (e, t) {
  if (!Zu(e)) throw Error(y(299));
  var n = !1,
    r = "",
    l = Ec;
  return (
    t != null &&
      (t.unstable_strictMode === !0 && (n = !0),
      t.identifierPrefix !== void 0 && (r = t.identifierPrefix),
      t.onRecoverableError !== void 0 && (l = t.onRecoverableError)),
    (t = Xu(e, 1, !1, null, null, n, !1, r, l)),
    (e[it] = t.current),
    tr(e.nodeType === 8 ? e.parentNode : e),
    new Gu(t)
  );
};
Pe.findDOMNode = function (e) {
  if (e == null) return null;
  if (e.nodeType === 1) return e;
  var t = e._reactInternals;
  if (t === void 0)
    throw typeof e.render == "function"
      ? Error(y(188))
      : ((e = Object.keys(e).join(",")), Error(y(268, e)));
  return ((e = Qs(t)), (e = e === null ? null : e.stateNode), e);
};
Pe.flushSync = function (e) {
  return Ht(e);
};
Pe.hydrate = function (e, t, n) {
  if (!Rl(t)) throw Error(y(200));
  return Ml(null, e, t, !0, n);
};
Pe.hydrateRoot = function (e, t, n) {
  if (!Zu(e)) throw Error(y(405));
  var r = (n != null && n.hydratedSources) || null,
    l = !1,
    i = "",
    u = Ec;
  if (
    (n != null &&
      (n.unstable_strictMode === !0 && (l = !0),
      n.identifierPrefix !== void 0 && (i = n.identifierPrefix),
      n.onRecoverableError !== void 0 && (u = n.onRecoverableError)),
    (t = xc(t, null, e, 1, n ?? null, l, !1, i, u)),
    (e[it] = t.current),
    tr(e),
    r)
  )
    for (e = 0; e < r.length; e++)
      ((n = r[e]),
        (l = n._getVersion),
        (l = l(n._source)),
        t.mutableSourceEagerHydrationData == null
          ? (t.mutableSourceEagerHydrationData = [n, l])
          : t.mutableSourceEagerHydrationData.push(n, l));
  return new Ll(t);
};
Pe.render = function (e, t, n) {
  if (!Rl(t)) throw Error(y(200));
  return Ml(null, e, t, !1, n);
};
Pe.unmountComponentAtNode = function (e) {
  if (!Rl(e)) throw Error(y(40));
  return e._reactRootContainer
    ? (Ht(function () {
        Ml(null, null, e, !1, function () {
          ((e._reactRootContainer = null), (e[it] = null));
        });
      }),
      !0)
    : !1;
};
Pe.unstable_batchedUpdates = Hu;
Pe.unstable_renderSubtreeIntoContainer = function (e, t, n, r) {
  if (!Rl(n)) throw Error(y(200));
  if (e == null || e._reactInternals === void 0) throw Error(y(38));
  return Ml(e, t, n, !1, r);
};
Pe.version = "18.3.1-next-f1338f8080-20240426";
function Cc() {
  if (
    !(
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
    )
  )
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Cc);
    } catch (e) {
      console.error(e);
    }
}
(Cc(), (Cs.exports = Pe));
var rp = Cs.exports,
  cs = rp;
((ai.createRoot = cs.createRoot), (ai.hydrateRoot = cs.hydrateRoot));
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const lp = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
  Nc = (...e) =>
    e
      .filter((t, n, r) => !!t && t.trim() !== "" && r.indexOf(t) === n)
      .join(" ")
      .trim();
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var ip = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const up = O.forwardRef(
  (
    {
      color: e = "currentColor",
      size: t = 24,
      strokeWidth: n = 2,
      absoluteStrokeWidth: r,
      className: l = "",
      children: i,
      iconNode: u,
      ...o
    },
    s,
  ) =>
    O.createElement(
      "svg",
      {
        ref: s,
        ...ip,
        width: t,
        height: t,
        stroke: e,
        strokeWidth: r ? (Number(n) * 24) / Number(t) : n,
        className: Nc("lucide", l),
        ...o,
      },
      [
        ...u.map(([c, m]) => O.createElement(c, m)),
        ...(Array.isArray(i) ? i : [i]),
      ],
    ),
);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const mr = (e, t) => {
  const n = O.forwardRef(({ className: r, ...l }, i) =>
    O.createElement(up, {
      ref: i,
      iconNode: t,
      className: Nc(`lucide-${lp(e)}`, r),
      ...l,
    }),
  );
  return ((n.displayName = `${e}`), n);
};
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const op = mr("ArrowLeft", [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const sp = mr("ArrowUpRight", [
  ["path", { d: "M7 7h10v10", key: "1tivn9" }],
  ["path", { d: "M7 17 17 7", key: "1vkiza" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const ap = mr("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const si = mr("Plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const nu = mr("X", [
    ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
    ["path", { d: "m6 6 12 12", key: "d8bk6v" }],
  ]),
  Dt = {
    battery: {
      index: "01",
      label: "Bộ pin",
      category: "Lưu trữ năng lượng",
      title: `Năng lượng
bên dưới bạn.`,
      short: "Khám phá bộ pin",
      description:
        "Bộ pin lưu trữ điện năng và cung cấp cho hệ truyền động. Trong mẫu xe ý tưởng này, bộ pin nằm thấp dưới khoang xe.",
      benefit: "Thiết kế thấp và phẳng giúp khoang xe phía trên rộng thoáng.",
      image: "/media/battery-blue.png",
      anchor: { x: 64, y: 72 },
      points: [
        {
          label: "Mô-đun pin",
          text: "Các tế bào pin được ghép thành mô-đun để lưu trữ năng lượng.",
          x: 31,
          y: 42,
        },
        {
          label: "Kết nối cao áp",
          text: "Các kết nối màu cam đánh dấu đường điện cao áp trong hình minh hoạ.",
          x: 27,
          y: 55,
        },
        {
          label: "Vỏ bảo vệ",
          text: "Vỏ bộ pin nâng đỡ và bảo vệ các bộ phận bên trong.",
          x: 49,
          y: 49,
        },
      ],
    },
    drive: {
      index: "02",
      label: "Truyền động điện",
      category: "Truyền năng lượng",
      title: `Điện năng
thành chuyển động.`,
      short: "Khám phá hệ truyền động",
      description:
        "Động cơ điện biến điện năng thành chuyển động quay. Bộ giảm tốc truyền chuyển động đó tới bánh xe.",
      benefit:
        "Khả năng điều khiển mô-men động cơ giúp xe phản hồi nhanh theo thao tác người lái.",
      image: "/media/drive-blue.png",
      anchor: { x: 25, y: 48 },
      points: [
        {
          label: "Cuộn dây stato",
          text: "Các cuộn dây cố định tạo ra từ trường quay.",
          x: 32,
          y: 46,
        },
        {
          label: "Rôto",
          text: "Rôto quay bên trong stato và dẫn động trục.",
          x: 24,
          y: 49,
        },
        {
          label: "Bộ giảm tốc",
          text: "Bánh răng giảm tốc độ quay và tăng mô-men tại bánh xe.",
          x: 48,
          y: 51,
        },
      ],
    },
    optics: {
      index: "03",
      label: "Thấu kính tiên tiến",
      category: "Ánh sáng & quang học",
      title: `Ánh sáng
được định hình.`,
      short: "Khám phá quang học đèn pha",
      description:
        "Trong đèn pha ý tưởng này, mô-đun LED tạo ánh sáng và thấu kính chiếu định hình chùm sáng.",
      benefit:
        "Phân bố ánh sáng chính xác giúp chiếu sáng đúng vị trí trên đường.",
      image: "/media/lenses-blue.png",
      anchor: { x: 36, y: 60 },
      points: [
        {
          label: "Thấu kính chiếu",
          text: "Thấu kính hướng ánh sáng theo hình dạng chùm sáng đã thiết kế.",
          x: 32.9,
          y: 55.7,
        },
        {
          label: "Mô-đun LED",
          text: "Nguồn sáng nằm phía sau hệ thấu kính chiếu.",
          x: 50.3,
          y: 57.2,
        },
        {
          label: "Bộ tản nhiệt",
          text: "Các lá kim loại tản nhiệt từ cụm nguồn sáng.",
          x: 61.9,
          y: 56.3,
        },
      ],
    },
  },
  cp = [
    ...["battery", "drive"].map((e) => ({
      id: e,
      index: Dt[e].index,
      label: Dt[e].label,
      anchor: Dt[e].anchor,
      target: e,
    })),
    {
      id: "paint",
      index: "03",
      label: "Màu sơn",
      anchor: { x: 55, y: 51 },
      target: null,
    },
    {
      id: "wheels",
      index: "04",
      label: "Kiểu mâm",
      anchor: { x: 48, y: 71 },
      target: null,
    },
  ],
  fp = {
    drive: ["/media/hood-hover-forward.mp4", "/media/hood-hover-reverse.mp4"],
    battery: [
      "/media/battery-hover-forward.mp4",
      "/media/battery-hover-reverse.mp4",
    ],
  };
function dp(e, t) {
  return e === t
    ? null
    : e
      ? { id: e, reverse: !0 }
      : t
        ? { id: t, reverse: !1 }
        : null;
}
function pp({ desired: e, mode: t, reduced: n, onNeutral: r }) {
  const l = O.useRef(null),
    i = O.useRef({ desired: e, mode: t, reduced: n, onNeutral: r }),
    u = O.useRef(() => {});
  return (
    (i.current = { desired: e, mode: t, reduced: n, onNeutral: r }),
    O.useEffect(() => {
      const o = l.current,
        s = o.getContext("2d", { alpha: !1 }),
        c = new Map();
      let m = !1,
        h = null,
        p = null,
        k = !1,
        S = !1,
        x = !1,
        L = 0,
        f = 0,
        a = 0,
        d;
      for (const [w, P] of Object.entries(fp))
        P.forEach((R, I) => {
          const V = document.createElement("video");
          ((V.muted = !0),
            (V.playsInline = !0),
            (V.preload = "auto"),
            (V.src = R),
            c.set(`${w}-${I}`, V));
        });
      function v(w) {
        w.readyState < 2 ||
          w.seeking ||
          !w.videoWidth ||
          ((o.width !== w.videoWidth || o.height !== w.videoHeight) &&
            ((o.width = w.videoWidth), (o.height = w.videoHeight)),
          s.drawImage(w, 0, 0, o.width, o.height),
          (o.style.opacity = "1"));
      }
      function E() {
        (L++,
          p == null || p.pause(),
          p && (p.onended = p.onerror = p.onloadeddata = p.onseeked = null),
          d == null || d(),
          (d = void 0),
          cancelAnimationFrame(f),
          clearTimeout(a),
          (k = !1),
          (p = null));
      }
      function _() {
        var qe, C;
        if (m) return;
        const w = i.current;
        if (w.mode === "entering") {
          S || (E(), (S = !0));
          return;
        }
        if (w.mode === "detail" || w.reduced) {
          (E(),
            (h = null),
            (S = !1),
            (o.style.opacity = "0"),
            (qe = w.onNeutral) == null || qe.call(w, !0));
          return;
        }
        if (w.mode !== "overview" || k || x) return;
        S = !1;
        const P = dp(h, w.desired);
        if (!P) return;
        const R = c.get(`${P.id}-${P.reverse ? 1 : 0}`);
        ((p = R), (k = !0), (C = w.onNeutral) == null || C.call(w, !1));
        const I = ++L,
          V = () => !m && L === I;
        function Te() {
          var j, M;
          V() &&
            (E(),
            (x = !0),
            (M = (j = i.current).onNeutral) == null || M.call(j, !0));
        }
        function Ze() {
          var j, M;
          V() &&
            (v(R),
            E(),
            (h = P.reverse ? null : P.id),
            (M = (j = i.current).onNeutral) == null || M.call(j, h === null),
            _());
        }
        function Je() {
          if (V())
            if ((v(R), "requestVideoFrameCallback" in R)) {
              const j = R.requestVideoFrameCallback(Je);
              d = () => R.cancelVideoFrameCallback(j);
            } else f = requestAnimationFrame(Je);
        }
        function at() {
          if (V()) {
            if (
              ((R.onseeked = R.onloadeddata = null),
              "requestVideoFrameCallback" in R)
            ) {
              const j = R.requestVideoFrameCallback(Je);
              d = () => R.cancelVideoFrameCallback(j);
            } else f = requestAnimationFrame(Je);
            R.play().catch(Te);
          }
        }
        function He() {
          V() &&
            ((R.onloadeddata = null),
            R.currentTime > 0.001
              ? ((R.onseeked = at), (R.currentTime = 0))
              : at());
        }
        ((R.onended = Ze),
          (R.onerror = Te),
          (a = window.setTimeout(Te, 15e3)),
          R.readyState >= 2 ? He() : ((R.onloadeddata = He), R.load()));
      }
      return (
        (u.current = _),
        _(),
        () => {
          ((m = !0), E(), (u.current = () => {}));
          for (const w of c.values()) (w.removeAttribute("src"), w.load());
        }
      );
    }, []),
    O.useEffect(() => {
      u.current();
    }, [e, t, n]),
    g.jsx("canvas", { ref: l, className: "hover-video", "aria-hidden": "true" })
  );
}
const sn = "/media/exterior-polished.png",
  Xr = {
    paint: [
      { id: "silver", label: "Bạc nguyên bản", color: "#c9cfd2", image: sn },
      {
        id: "electric",
        label: "Xanh điện",
        color: "#edff39",
        image: "/media/config/electric-green.png",
      },
      {
        id: "lime",
        label: "Xanh chanh",
        color: "#9fdc32",
        image: "/media/config/lime-green.png",
      },
      {
        id: "sky",
        label: "Xanh trời",
        color: "#708fa2",
        image: "/media/config/sky-blue.png",
      },
      {
        id: "graphite",
        label: "Xám than",
        color: "#30363c",
        image: "/media/config/graphite.png",
      },
    ],
    wheels: [
      { id: "original", label: "Đa chấu", image: sn },
      {
        id: "aero",
        label: "Mâm khí động",
        image: "/media/config/wheels-aero.png",
      },
      {
        id: "forged",
        label: "Mâm thể thao",
        image: "/media/config/wheels-forged.png",
      },
    ],
  };
function fs(e, t, n) {
  return !n && (!e || e === t);
}
function hp({
  mode: e,
  selected: t,
  loaded: n,
  unavailable: r,
  waiting: l,
  onSelect: i,
  onClose: u,
}) {
  const o = Xr[e],
    s = o.find((c) => c.id === t);
  return g.jsxs("div", {
    className: `appearance-menu ${e}`,
    id: `appearance-${e}`,
    role: "group",
    "aria-label": e === "paint" ? "Màu sơn" : "Kiểu mâm",
    children: [
      g.jsxs("div", {
        className: "appearance-heading",
        children: [
          g.jsx("span", { children: e === "paint" ? "Màu sơn" : "Kiểu mâm" }),
          g.jsx("button", {
            className: "appearance-close",
            onClick: u,
            "aria-label": "Đóng và khôi phục xe ban đầu",
            children: g.jsx(nu, { size: 16, strokeWidth: 1.5 }),
          }),
        ],
      }),
      g.jsx("div", {
        className: "appearance-options",
        children: o.map((c) =>
          g.jsx(
            "button",
            {
              className: `appearance-option ${c.id === t ? "selected" : ""}`,
              disabled: l || !n.has(c.image),
              "aria-label": `${c.label}${r.has(c.image) ? " — chưa tải được" : ""}`,
              "aria-pressed": c.id === t,
              title: c.label,
              onClick: () => i(c.id),
              children:
                e === "paint"
                  ? g.jsx("span", {
                      className: "paint-chip",
                      style: {
                        backgroundColor: c.color,
                        color: c.id === "graphite" ? "#fff" : "#111",
                      },
                      children: c.id === t && g.jsx(ap, { size: 14 }),
                    })
                  : g.jsx("span", {
                      className: "wheel-chip",
                      style: { backgroundImage: `url("${c.image}")` },
                    }),
            },
            c.id,
          ),
        ),
      }),
      g.jsxs("div", {
        className: "appearance-caption",
        "aria-live": "polite",
        children: [
          l ? "Đang trở về xe ban đầu…" : s.label,
          g.jsx("small", {
            children: r.size
              ? "Một số lựa chọn chưa tải được"
              : "Đóng để khám phá hệ thống khác",
          }),
        ],
      }),
    ],
  });
}
const ds = "/media/exterior-polished.png";
function mp() {
  const [e, t] = O.useState("overview"),
    [n, r] = O.useState("battery"),
    [l, i] = O.useState(null),
    [u, o] = O.useState(null),
    [s, c] = O.useState(!1),
    [m, h] = O.useState(""),
    [p, k] = O.useState(!1),
    [S, x] = O.useState(!1),
    [L, f] = O.useState(null),
    [a, d] = O.useState(!1),
    [v, E] = O.useState(!1),
    [_, w] = O.useState("silver"),
    [P, R] = O.useState(sn),
    [I, V] = O.useState(!0),
    [Te, Ze] = O.useState(() => new Set([sn])),
    [Je, at] = O.useState(() => new Set()),
    He = O.useRef(new Set()),
    qe = O.useRef(),
    C = O.useRef(),
    j = O.useRef({}),
    M = O.useRef(!1),
    B = O.useRef(!1),
    X = O.useRef(0),
    ct = O.useRef(),
    We = O.useRef(),
    Kt = O.useRef(null),
    [Se, Xt] = O.useState({}),
    Ju = O.useRef(null),
    qu = O.useRef({}),
    xe = Dt[n],
    vr = e === "entering" || e === "returning";
  (O.useEffect(() => {
    const T = matchMedia("(prefers-reduced-motion: reduce)"),
      z = () => k(T.matches);
    return (
      z(),
      T.addEventListener("change", z),
      () => {
        (T.removeEventListener("change", z),
          clearTimeout(ct.current),
          clearTimeout(We.current),
          clearTimeout(qe.current),
          clearTimeout(C.current),
          X.current++);
      }
    );
  }, []),
    O.useEffect(() => {
      if (!L) return;
      let T = !1;
      const z = Xr[L].filter((F) => !He.current.has(F.image));
      return (
        z.forEach((F) => {
          He.current.add(F.image);
          const b = new Image();
          ((b.onload = () => {
            b.decode()
              .then(() => {
                T ||
                  (Ze((Q) => new Set(Q).add(F.image)),
                  at((Q) => {
                    const gr = new Set(Q);
                    return (gr.delete(F.image), gr);
                  }));
              })
              .catch(() => {
                T || at((Q) => new Set(Q).add(F.image));
              });
          }),
            (b.onerror = () => {
              T || at((Q) => new Set(Q).add(F.image));
            }),
            (b.src = F.image));
        }),
        () => {
          ((T = !0), z.forEach((F) => He.current.delete(F.image)));
        }
      );
    }, [L]));
  function Ol(T) {
    e !== "overview" ||
      !fs(L, T, v) ||
      (clearTimeout(C.current),
      i(null),
      L !== T && (f(T), d(!1), w(Xr[T][0].id), R(sn)));
  }
  function Nn(T = !0) {
    if (!L || v) return;
    const z = L;
    (clearTimeout(C.current),
      E(!0),
      i(null),
      (qe.current = window.setTimeout(
        () => {
          var F;
          (f(null),
            d(!1),
            E(!1),
            R(sn),
            T &&
              ((M.current = !0),
              (F = j.current[z]) == null || F.focus({ preventScroll: !0 }),
              (M.current = !1)));
        },
        p ? 0 : 260,
      )));
  }
  function _c(T) {
    if (!L || v || !I) return;
    const z = Xr[L].find((F) => F.id === T);
    !z || !Te.has(z.image) || (d(!0), w(T), R(z.image));
  }
  (O.useEffect(() => {
    const T = Kt.current,
      z = () => {
        const { width: b } = T.getBoundingClientRect(),
          Q = b <= 900,
          gr =
            Math.max(700, window.innerHeight) -
            (window.innerHeight <= 780 ? 64 : 76) -
            164 -
            88,
          Il = Q
            ? b - 40
            : Math.min(
                b - 2 * Math.min(72, Math.max(24, b * 0.04)),
                (gr * 1672) / 941,
              ),
          zc = (Il * 941) / 1672;
        Xt({ width: Il, height: zc, left: (b - Il) / 2, top: Q ? 132 : 88 });
      },
      F = new ResizeObserver(z);
    return (
      F.observe(T),
      window.addEventListener("resize", z),
      () => {
        (F.disconnect(), window.removeEventListener("resize", z));
      }
    );
  }, []),
    O.useEffect(() => {
      let T = !1;
      return (
        Promise.all(
          [ds, Dt.battery.image, Dt.drive.image].map(
            (z) =>
              new Promise((F, b) => {
                const Q = new Image();
                ((Q.onload = () => {
                  Q.decode().then(F, F);
                }),
                  (Q.onerror = b),
                  (Q.src = z));
              }),
          ),
        )
          .then(() => {
            T || c(!0);
          })
          .catch(() => {
            T || h("Không tải được hình ảnh. Vui lòng tải lại trang.");
          }),
        () => {
          T = !0;
        }
      );
    }, []));
  function Pc(T, z = n) {
    (clearTimeout(ct.current),
      t(T ? "overview" : "detail"),
      x(!T),
      (B.current = !1),
      setTimeout(() => {
        var F, b;
        return T
          ? (F = qu.current[z]) == null
            ? void 0
            : F.focus({ preventScroll: !0 })
          : (b = Ju.current) == null
            ? void 0
            : b.focus({ preventScroll: !0 });
      }, 0));
  }
  function bu(T, z = !1) {
    if (T === "optics" || L || B.current || !s || (!z && e !== "overview"))
      return;
    B.current = !0;
    const F = ++X.current;
    (r(T),
      i(null),
      o(null),
      h(""),
      t(z ? "returning" : "entering"),
      (We.current = window.setTimeout(
        () => {
          X.current === F && x(!z);
        },
        p ? 0 : 350,
      )),
      (ct.current = window.setTimeout(
        () => {
          X.current === F && Pc(z, T);
        },
        p ? 0 : 1250,
      )));
  }
  function eo() {
    e === "detail" && bu(n, !0);
  }
  return (
    O.useEffect(() => {
      const T = (z) => {
        z.key === "Escape" && (L ? Nn() : eo());
      };
      return (
        window.addEventListener("keydown", T),
        () => window.removeEventListener("keydown", T)
      );
    }),
    g.jsxs("main", {
      className: `experience phase-${e} ${p ? "reduced" : ""}`,
      style: {
        "--scene-width": typeof Se.width == "number" ? `${Se.width}px` : void 0,
        "--scene-height":
          typeof Se.height == "number" ? `${Se.height}px` : void 0,
      },
      "aria-busy": vr,
      children: [
        g.jsxs("header", {
          className: "masthead",
          children: [
            g.jsx("a", {
              className: "wordmark",
              href: "/",
              "aria-label": "Trở về tổng quan",
              children: "AutoCare-AI",
            }),
            g.jsx("span", {
              className: "header-middle",
              children: "Thiết kế xe điện",
            }),
            g.jsx("span", {
              className: "concept-label",
              children: "Ý tưởng độc lập",
            }),
          ],
        }),
        g.jsxs("section", {
          ref: Kt,
          className: "stage",
          "aria-label": "Khám phá các hệ thống của xe",
          children: [
            g.jsxs("div", {
              className: "image-plane",
              style: {
                ...Se,
                "--focus-x": `${xe.anchor.x}%`,
                "--focus-y": `${xe.anchor.y}%`,
              },
              children: [
                g.jsxs("div", {
                  className: "media-envelope",
                  children: [
                    g.jsx("div", {
                      className: "exterior-envelope",
                      children: g.jsxs("div", {
                        className: "car-visual",
                        children: [
                          g.jsx("img", {
                            className: "car-image",
                            src: ds,
                            alt: "Mẫu xe điện màu bạc trong studio",
                            draggable: !1,
                          }),
                          g.jsx(pp, {
                            desired:
                              !L && (l === "drive" || l === "battery")
                                ? l
                                : null,
                            mode: e,
                            reduced: p,
                            onNeutral: V,
                          }),
                          g.jsx("div", {
                            className: `appearance-visual ${L && I && !v ? "shown" : ""}`,
                            "aria-hidden": "true",
                            children: g.jsx("img", {
                              src: P,
                              alt: "",
                              draggable: !1,
                            }),
                          }),
                        ],
                      }),
                    }),
                    g.jsx("div", {
                      className: `detail-visual ${S ? "shown" : ""}`,
                      children: g.jsx("img", {
                        className: "detail-image",
                        src: xe.image,
                        alt: `Hình minh hoạ bên trong ${xe.label.toLowerCase()}`,
                        draggable: !1,
                      }),
                    }),
                  ],
                }),
                e === "overview" &&
                  s &&
                  cp.map((T) => {
                    const { id: z, target: F } = T,
                      b = fs(L, z, v);
                    return z === "paint" || z === "wheels"
                      ? g.jsxs(
                          "div",
                          {
                            className: `appearance-hotspot ${L === z ? "expanded" : ""}`,
                            style: {
                              "--anchor-x": `${T.anchor.x}%`,
                              "--anchor-y": `${T.anchor.y}%`,
                            },
                            onPointerEnter: () => Ol(z),
                            onPointerLeave: (Q) => {
                              !a &&
                                !Q.currentTarget.contains(
                                  document.activeElement,
                                ) &&
                                (C.current = window.setTimeout(
                                  () => Nn(!1),
                                  140,
                                ));
                            },
                            onBlur: (Q) => {
                              !a &&
                                !Q.currentTarget.contains(Q.relatedTarget) &&
                                Nn(!1);
                            },
                            children: [
                              g.jsxs("button", {
                                ref: (Q) => {
                                  j.current[z] = Q;
                                },
                                className: `hotspot ${L === z ? "active" : ""}`,
                                disabled: !b,
                                onFocus: () => {
                                  M.current || Ol(z);
                                },
                                onClick: () => {
                                  L === z && a ? Nn() : (Ol(z), d(!0));
                                },
                                "aria-expanded": L === z && !v,
                                "aria-controls": `appearance-${z}`,
                                "aria-label": T.label,
                                children: [
                                  g.jsx("span", {
                                    className: "hotspot-ring",
                                    children:
                                      L === z && a
                                        ? g.jsx(nu, {
                                            size: 14,
                                            strokeWidth: 1.5,
                                          })
                                        : g.jsx(si, {
                                            size: 14,
                                            strokeWidth: 1.5,
                                          }),
                                  }),
                                  g.jsx("span", {
                                    className: "hotspot-label",
                                    children:
                                      z === "paint" ? "Màu sơn" : "Kiểu mâm",
                                  }),
                                ],
                              }),
                              L === z &&
                                !v &&
                                g.jsx("span", {
                                  className: "menu-bridge",
                                  "aria-hidden": "true",
                                }),
                              L === z &&
                                !v &&
                                g.jsx(hp, {
                                  mode: z,
                                  selected: _,
                                  loaded: Te,
                                  unavailable: Je,
                                  waiting: !I,
                                  onSelect: _c,
                                  onClose: () => Nn(),
                                }),
                            ],
                          },
                          z,
                        )
                      : g.jsxs(
                          "button",
                          {
                            ref: (Q) => {
                              F && (qu.current[F] = Q);
                            },
                            className: `hotspot ${l === z ? "active" : ""}`,
                            style: {
                              left: `${T.anchor.x}%`,
                              top: `${T.anchor.y}%`,
                            },
                            disabled: !b,
                            onPointerEnter: () => {
                              b && i(z);
                            },
                            onPointerLeave: () => i(null),
                            onFocus: () => {
                              b && i(z);
                            },
                            onBlur: () => i(null),
                            onClick: F ? () => void bu(F) : void 0,
                            "aria-label": F ? Dt[F].short : T.label,
                            children: [
                              g.jsx("span", {
                                className: "hotspot-ring",
                                children: g.jsx(si, {
                                  size: 14,
                                  strokeWidth: 1.5,
                                }),
                              }),
                              g.jsxs("span", {
                                className: "hotspot-label",
                                children: [
                                  T.label,
                                  F && g.jsx(sp, { size: 15 }),
                                ],
                              }),
                            ],
                          },
                          z,
                        );
                  }),
                e === "detail" &&
                  xe.points.map((T, z) =>
                    g.jsxs(
                      "button",
                      {
                        className: `annotation ${u === z ? "open" : ""}`,
                        style: { left: `${T.x}%`, top: `${T.y}%` },
                        "aria-label": T.label,
                        "aria-expanded": u === z,
                        onClick: () => o(u === z ? null : z),
                        children: [
                          g.jsx("span", {
                            children: String(z + 1).padStart(2, "0"),
                          }),
                          g.jsx("span", {
                            className: "annotation-label",
                            children: T.label,
                          }),
                        ],
                      },
                      T.label,
                    ),
                  ),
              ],
            }),
            g.jsxs("div", {
              className: `intro ${e !== "overview" ? "hide" : ""}`,
              "aria-hidden": e !== "overview",
              children: [
                g.jsx("h1", { children: "Hiểu xe từ bên trong." }),
                g.jsxs("p", {
                  className: "intro-description",
                  children: [
                    g.jsx("span", { children: "Khám phá dưới lớp vỏ." }),
                    g.jsx("span", { children: "Chọn một điểm để bắt đầu." }),
                  ],
                }),
              ],
            }),
            e !== "overview" &&
              g.jsxs("button", {
                ref: Ju,
                className: "back",
                onClick: eo,
                disabled: vr,
                "aria-label": "Quay lại chiếc xe",
                children: [
                  g.jsx(op, { size: 18 }),
                  g.jsx("span", {
                    children:
                      e === "returning" ? "Đang trở về" : "Quay lại chiếc xe",
                  }),
                  g.jsx("kbd", { children: "Esc" }),
                ],
              }),
            g.jsxs("aside", {
              className: `detail-copy ${e === "detail" ? "shown" : ""}`,
              "aria-hidden": e !== "detail",
              children: [
                g.jsxs("div", {
                  className: "detail-introduction",
                  children: [
                    g.jsx("p", { className: "eyebrow", children: xe.category }),
                    g.jsx("h2", {
                      children: xe.title
                        .split(
                          `
`,
                        )
                        .map((T) => g.jsx("span", { children: T }, T)),
                    }),
                    g.jsx("p", {
                      className: "system-description",
                      children: xe.description,
                    }),
                  ],
                }),
                g.jsxs("div", {
                  className: "detail-components",
                  children: [
                    g.jsx("div", {
                      className: "part-list",
                      children: xe.points.map((T, z) =>
                        g.jsxs(
                          "button",
                          {
                            tabIndex: e === "detail" ? 0 : -1,
                            className: u === z ? "selected" : "",
                            onClick: () => o(u === z ? null : z),
                            "aria-expanded": u === z,
                            children: [
                              g.jsxs("span", {
                                className: "part-row",
                                children: [
                                  g.jsx("small", {
                                    children: String(z + 1).padStart(2, "0"),
                                  }),
                                  T.label,
                                  g.jsx(si, { size: 14 }),
                                ],
                              }),
                              u === z &&
                                g.jsx("span", {
                                  className: "part-description",
                                  children: T.text,
                                }),
                            ],
                          },
                          T.label,
                        ),
                      ),
                    }),
                    g.jsxs("div", {
                      className: "benefit",
                      children: [
                        g.jsx("span", { children: "Dành cho người lái" }),
                        g.jsx("p", { children: xe.benefit }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            (vr || !s) &&
              g.jsxs("div", {
                className: "transition-status",
                children: [
                  g.jsx("span", { className: "small-dot" }),
                  s
                    ? e === "returning"
                      ? "Đang trở về ngoại thất"
                      : `Bên trong ${xe.label.toLowerCase()}`
                    : "Đang chuẩn bị góc nhìn",
                ],
              }),
          ],
        }),
        g.jsxs("footer", {
          className: "scene-footer",
          children: [
            g.jsxs("div", {
              className: "feature-notes",
              "aria-label": "Các cách khám phá",
              children: [
                g.jsxs("div", {
                  className: "feature-note",
                  children: [
                    g.jsx("h3", { children: "Truyền động điện" }),
                    g.jsx("p", {
                      children:
                        "Mở nắp ca-pô. Tìm hiểu cách động cơ biến điện năng thành chuyển động.",
                    }),
                  ],
                }),
                g.jsxs("div", {
                  className: "feature-note",
                  children: [
                    g.jsx("h3", { children: "Cấu trúc bộ pin" }),
                    g.jsx("p", {
                      children:
                        "Nhìn dưới thân xe. Khám phá nguồn năng lượng bên dưới khoang xe.",
                    }),
                  ],
                }),
                g.jsxs("div", {
                  className: "feature-note",
                  children: [
                    g.jsx("h3", { children: "Màu sơn ngoại thất" }),
                    g.jsx("p", {
                      children:
                        "Năm màu sơn. Từ bạc nguyên bản đến xanh điện nổi bật.",
                    }),
                  ],
                }),
                g.jsxs("div", {
                  className: "feature-note",
                  children: [
                    g.jsx("h3", { children: "Thiết kế mâm" }),
                    g.jsx("p", {
                      children: "Ba kiểu mâm: đa chấu, khí động và thể thao.",
                    }),
                  ],
                }),
              ],
            }),
            g.jsxs("div", {
              className: "footer-baseline",
              children: [
                g.jsx("span", { children: "AutoCareAI — Nghiên cứu thiết kế" }),
                g.jsx("span", {
                  children:
                    e === "overview"
                      ? "Khám phá hệ thống. Tuỳ chọn ngoại thất."
                      : "Minh hoạ kỹ thuật. Ý tưởng thiết kế.",
                }),
              ],
            }),
          ],
        }),
        g.jsx("p", {
          className: "sr-only",
          role: "status",
          "aria-live": "polite",
          children: vr
            ? `${e === "entering" ? "Đang mở" : "Đang đóng"} ${xe.label}`
            : e === "detail"
              ? `Góc nhìn ${xe.label}. Nhấn Escape để quay lại.`
              : "Tổng quan xe. Chọn một hệ thống.",
        }),
        m &&
          g.jsxs("div", {
            className: "error-message",
            role: "alert",
            children: [
              m,
              g.jsx("button", {
                onClick: () => h(""),
                "aria-label": "Đóng thông báo",
                children: g.jsx(nu, { size: 16 }),
              }),
            ],
          }),
      ],
    })
  );
}
ai.createRoot(document.getElementById("root")).render(
  g.jsx(Qc.StrictMode, { children: g.jsx(mp, {}) }),
);
