// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"ejrGw":[function(require,module,exports) {
var _utilsJs = require("./utils.js");
const addNewIssue = (issues, issue)=>{
    const issueTitleElement = document.createElement("div");
    const newIssueElement = document.createElement("div");
    issueTitleElement.textContent = issue;
    issueTitleElement.className = "issue-title";
    newIssueElement.id = "issue-" + issue;
    newIssueElement.className = "issue";
    newIssueElement.setAttribute("key", issue);
    newIssueElement.appendChild(issueTitleElement);
    issues.appendChild(newIssueElement);
};
const viewIssues = (issues = [])=>{
    const issuesElement = document.getElementById("issues");
    issuesElement.innerHTML = "";
    if (issues.length > 0) for (const issue of issues)addNewIssue(issuesElement, issue);
    else issuesElement.innerHTML = '<i class="row">No issues to show</i>';
};
document.addEventListener("DOMContentLoaded", async ()=>{
    const activeTab = await (0, _utilsJs.getActiveTabURL)();
    const { prNum  } = (0, _utilsJs.getPRInfo)(activeTab.url);
    if (activeTab.url.includes("github.com") && prNum) chrome.storage.sync.get([
        prNum
    ], (data)=>{
        const issues = data[prNum] ? JSON.parse(data[prNum]) : [];
        console.log(issues);
        viewIssues(issues);
    });
    else {
        const container = document.getElementsByClassName("container")[0];
        container.innerHTML = '<div class="title">This is not a GitHub Pull Request page.</div>';
    }
});

},{"./utils.js":"en4he"}],"en4he":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "getActiveTabURL", ()=>getActiveTabURL);
parcelHelpers.export(exports, "getPRInfo", ()=>getPRInfo);
/* currently unused */ parcelHelpers.export(exports, "getElementsByTextFromSelector", ()=>getElementsByTextFromSelector);
parcelHelpers.export(exports, "getElementsByTextFromElements", ()=>getElementsByTextFromElements);
async function getActiveTabURL() {
    const tabs = await chrome.tabs.query({
        currentWindow: true,
        active: true
    });
    return tabs[0];
}
function getPRInfo(url) {
    const prLinkRegex = /pull\/\d*$/g;
    const prLinkResult = url.match(prLinkRegex);
    let prLink;
    let _, prNum;
    if (prLinkResult) {
        prLink = url;
        [_, prNum] = url.match(prLinkRegex)[0].split("/");
    }
    return {
        prNum,
        prLink
    };
}
function getElementsByTextFromSelector(selector, text) {
    var elements = document.querySelectorAll(selector);
    return getElementsByTextFromElements(elements, text);
}
function getElementsByTextFromElements(elements, text) {
    return [].filter.call(elements, function(element) {
        var contents = element.textContent || element.innerText || "";
        return contents.indexOf(text) != -1;
    });
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gkKU3":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, "__esModule", {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === "default" || key === "__esModule" || dest.hasOwnProperty(key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}]},["ejrGw"], "ejrGw", "parcelRequired028")

//# sourceMappingURL=popup.ef3d8082.js.map
