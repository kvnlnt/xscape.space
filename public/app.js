(() => {
  // src/app/lib/Dom.ts
  function useDom(selector, ...attrs) {
    let element = document.querySelector(selector);
    const setAttrs = (...attrs2) => attrs2.forEach(([k, v]) => element[k] = v);
    if (!element) {
      window.addEventListener("DOMContentLoaded", () => {
        element = document.querySelector(selector);
        setAttrs(...attrs);
      });
    } else {
      setAttrs(...attrs);
    }
    const setHtml = (...children) => {
      element.innerHTML = "";
      children.forEach((child) => element.appendChild(child));
    };
    return [setHtml, setAttrs];
  }

  // src/app/framework/colors.ts
  var Colors = {
    black: [0, 0, 5],
    brown: [44, 11, 14],
    red: [0, 100, 50],
    blue: [240, 100, 50],
    yellow: [55, 100, 50],
    green: [118, 100, 50],
    purple: [270, 100, 50],
    orange: [30, 100, 50],
    transparent: "transparent",
    white: [0, 0, 100]
  };
  var Color = (color, adjustLightness = 0, opacity = 1) => {
    if (color === "transparent")
      return color;
    const [h, s, l] = Colors[color];
    const hsla = `hsla(${h}deg,${s}%,${l + adjustLightness}%,${opacity})`;
    return hsla;
  };

  // src/app/framework/css.ts
  var Breakpoints;
  (function(Breakpoints2) {
    Breakpoints2[Breakpoints2["MOBILE"] = 0] = "MOBILE";
    Breakpoints2[Breakpoints2["TABLET"] = 720] = "TABLET";
    Breakpoints2[Breakpoints2["DESKTOP"] = 1200] = "DESKTOP";
  })(Breakpoints || (Breakpoints = {}));
  function uuid(str = "xxxxxxxx") {
    function getRandomSymbol(symbol) {
      let array;
      if (symbol === "y") {
        array = ["8", "9", "a", "b"];
        return array[Math.floor(Math.random() * array.length)];
      }
      array = new Uint8Array(1);
      window.crypto.getRandomValues(array);
      return (array[0] % 16).toString(16);
    }
    return str.replace(/[xy]/g, getRandomSymbol);
  }
  var CSS = (declarations) => {
    const id = uuid();
    const style = document.createElement("style");
    style.id = id;
    document.getElementsByTagName("head")[0].appendChild(style);
    const render = () => {
      style.innerHTML = "";
      const styles = [];
      const addStyle = (breakpoint = 0) => {
        styles.push(`@media screen and (min-width:${breakpoint}px) {
`);
        const suffix = {
          [0]: "",
          [720]: "_on_tablet",
          [1200]: "_on_desktop"
        };
        Object.entries(declarations).forEach(([selector, declarations2]) => {
          styles.push(`.${selector}${suffix[breakpoint]}_${id} {`);
          declarations2.forEach(([prop, val, render2 = true]) => render2 ? styles.push(`${prop.replace(/([A-Z])/g, "-$1").toLowerCase()}:${val};`) : null);
          styles.push(`}
`);
          styles.push(`.${selector}_on_hover${suffix[breakpoint]}_${id}:hover {`);
          declarations2.forEach(([prop, val, render2 = true]) => render2 ? styles.push(`${prop.replace(/([A-Z])/g, "-$1").toLowerCase()}:${val};`) : null);
          styles.push(`}
`);
        });
        styles.push(`}
`);
      };
      addStyle(0);
      addStyle(720);
      addStyle(1200);
      style.innerHTML = styles.join("");
    };
    render();
    const getter = (...list) => {
      return list.filter((i) => i !== null).map((item) => `${item}_${id}`).join(" ");
    };
    return getter;
  };

  // src/app/framework/fsm.ts
  var FSM = (context, machine) => {
    let _context = context;
    const _subs = [];
    const sub = (action, cb) => {
      _subs.push({
        action,
        cb
      });
    };
    const get = (key) => {
      return _context[key];
    };
    const pub = (action, contextUpdate) => {
      _context = machine({action, payload: contextUpdate}, _context);
      _subs.filter((sub2) => sub2["action"] === action).forEach((i) => i.cb(_context));
      return _context;
    };
    return {
      get,
      pub,
      sub
    };
  };

  // src/app/framework/html.ts
  var Html = (features) => (tag, ...attrs) => (...children) => {
    const el = document.createElementNS("http://www.w3.org/1999/xhtml", tag);
    attrs.forEach(([attr, ...args]) => features[attr](el, ...args));
    children.forEach((child) => {
      if (child instanceof Node)
        el.appendChild(child);
      if (typeof child === "string" || typeof child === "number")
        el.innerHTML += child;
    });
    return el;
  };
  var ClassList = (el, classes) => el.className = classes;
  var Style = (el, style) => el.setAttribute("style", style);

  // src/app/components/Spectral.ts
  var css = CSS({
    wrapper: [
      ["display", "flex"],
      ["flexDirection", "row"],
      ["alignItems", "center"],
      ["justifyContent", "center"],
      ["height", "100%"],
      ["cursor", "pointer"]
    ],
    bar_bg: [
      ["backgroundColor", Color("white", 0, 0.01)],
      ["marginLeft", "5px"],
      ["borderRadius", "14px"],
      ["display", "flex"],
      ["flexDirection", "column"],
      ["alignItems", "center"],
      ["justifyContent", "center"],
      ["height", "100%"],
      ["width", "12px"],
      ["position", "relative"]
    ],
    bar: [
      ["backgroundColor", Color("purple")],
      ["borderRadius", "7px"],
      ["width", "100%"],
      ["transition", "all 0.50s"],
      ["height", "0%"],
      ["position", "absolute"]
    ]
  });
  var $ = Html({
    css: ClassList,
    style: Style
  });
  var SpectralBar = (bar) => {
    const [h1, o1, h2, o2, h3, o3] = bar;
    const t = $("div", ["css", css("wrapper")])($("div", ["css", css("bar_bg")])($("div", ["css", css("bar")], ["style", `height:${h1}%;top:${o1}%`])(), $("div", ["css", css("bar")], ["style", `height:${h2}%;top:${o2}%`])(), $("div", ["css", css("bar")], ["style", `height:${h3}%;top:${o3}%`])()));
    return t;
  };
  var Spectrum = (char) => {
    const t = $("div", ["css", css("wrapper")])(SpectralBar(CHAR[char][0]), SpectralBar(CHAR[char][1]), SpectralBar(CHAR[char][2]));
    return t;
  };
  var CHAR = {
    0: [
      [100, 0, 0, 0, 0, 0],
      [20, 0, 20, 80, 0, 0],
      [0, 0, 100, 0, 0, 0]
    ],
    1: [
      [20, 0, 20, 80, 0, 0],
      [100, 0, 0, 0, 0, 0],
      [0, 0, 20, 80, 0, 0]
    ],
    2: [
      [20, 0, 60, 40, 0, 0],
      [20, 0, 20, 80, 20, 40],
      [60, 0, 20, 80, 0, 0]
    ],
    3: [
      [20, 0, 20, 80, 20, 40],
      [20, 0, 20, 80, 20, 40],
      [100, 0, 0, 0, 0, 0]
    ],
    4: [
      [60, 0, 0, 0, 0, 0],
      [20, 40, 0, 0, 0, 0],
      [100, 0, 0, 0, 0, 0]
    ],
    5: [
      [60, 0, 20, 80, 0, 0],
      [20, 0, 20, 80, 20, 40],
      [20, 0, 60, 40, 0, 0]
    ],
    6: [
      [100, 0, 0, 0, 0, 0],
      [20, 0, 20, 80, 20, 40],
      [20, 0, 60, 40, 0, 0]
    ],
    7: [
      [20, 0, 0, 0, 0, 0],
      [20, 0, 0, 0, 0, 0],
      [100, 0, 0, 0, 0, 0]
    ],
    8: [
      [100, 0, 0, 0, 0, 0],
      [20, 0, 20, 80, 20, 40],
      [100, 0, 0, 0, 0, 0]
    ],
    9: [
      [60, 0, 0, 0, 0, 0],
      [20, 0, 20, 40, 0, 0],
      [100, 0, 0, 0, 0, 0]
    ],
    A: [
      [100, 0, 0, 0, 0, 0],
      [20, 0, 20, 40, 0, 0],
      [100, 0, 0, 0, 0, 0]
    ],
    B: [
      [100, 0, 0, 0, 0, 0],
      [20, 0, 20, 80, 20, 40],
      [100, 0, 0, 0, 0, 0]
    ],
    C: [
      [100, 0, 0, 0, 0, 0],
      [20, 0, 20, 80, 0, 0],
      [20, 0, 20, 80, 0, 0]
    ],
    D: [
      [100, 0, 0, 0, 0, 0],
      [20, 0, 20, 80, 0, 0],
      [100, 0, 0, 0, 0, 0]
    ],
    E: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ],
    F: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ],
    G: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ],
    H: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ],
    I: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ],
    J: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ],
    K: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ],
    L: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ],
    M: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ],
    N: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ],
    O: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ],
    P: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ],
    Q: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ],
    R: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ],
    S: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ],
    T: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ],
    U: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ],
    V: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ],
    W: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ],
    X: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ],
    Y: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ],
    Z: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ]
  };

  // src/app/pages/DesignSystem.ts
  var css2 = CSS({
    container: [
      ["display", "grid"],
      ["height", "100vh"],
      ["width", "100vw"],
      ["gridTemplateColumns", "repeat(5, 1fr)"],
      ["gridTemplateRows", "auto"],
      ["backgroundColor", Color("black")],
      ["gridGap", "10px"],
      ["padding", "10px"],
      ["boxSizing", "border-box"],
      ["color", Color("white")]
    ],
    letter: [
      ["display", "flex"],
      ["border", "1px solid white"],
      ["alignItems", "center"],
      ["justifyContent", "center"],
      ["padding", "10px"]
    ]
  });
  var DesignSystem = () => {
    const fsm = FSM({state: "INIT"}, (message, context) => {
      switch (context.state) {
        case "INIT":
          switch (message.action) {
          }
      }
      return context;
    });
    const $2 = Html({
      css: ClassList
    });
    const template = $2("div", ["css", css2("container")])(...Object.entries(CHAR).map(([k]) => $2("div", ["css", css2("letter")])(Spectrum(k))));
    return template;
  };

  // src/main.ts
  window.addEventListener("DOMContentLoaded", async () => {
    const resetStyle = `margin:0px;padding:0px;width:100vw;height:100vh;`;
    const [body] = useDom("body", ["style", resetStyle]);
    body(DesignSystem());
  });
})();
//# sourceMappingURL=app.js.map
