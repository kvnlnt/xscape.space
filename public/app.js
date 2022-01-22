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

  // src/app/lib/Css.ts
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
  var useCss = (declarations) => {
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
    const setter = (update) => {
      declarations = {...declarations, ...update};
      render();
    };
    return [getter, setter];
  };

  // src/app/lib/Event.ts
  var useEvent = () => {
    const subscribers = [];
    const pub = (eventName) => subscribers.filter((i) => i.eventName === eventName).forEach((i) => i.cb());
    const sub = (eventName, cb) => subscribers.push({eventName, cb});
    return [pub, sub];
  };

  // src/app/lib/Html.ts
  function HTML({tag, attrs = [], children = []}) {
    const el = document.createElementNS("http://www.w3.org/1999/xhtml", tag);
    attrs.forEach(([k, v]) => {
      if (typeof v === "function") {
        el.addEventListener(k.substring(2, k.length), (e) => v(e));
      } else if (typeof v === "boolean") {
        if (v === true)
          el.setAttribute(k, "");
      } else {
        if (v)
          el.setAttribute(k, v.toString());
      }
    });
    children.forEach((child) => {
      if (child instanceof Node)
        el.appendChild(child);
      if (typeof child === "string" || typeof child === "number")
        el.innerHTML += child;
    });
    return el;
  }
  function useHtml(tag, ...attrs) {
    let container;
    let hasRendered = false;
    const replace = (...children) => {
      const newContainer = HTML({tag, attrs, children});
      container.replaceWith(newContainer);
      container = newContainer;
      return container;
    };
    const element = (...children) => {
      if (hasRendered)
        return replace(...children);
      container = HTML({tag, attrs, children});
      hasRendered = true;
      return container;
    };
    const updateAttrs = (...attrs2) => {
      attrs2.forEach((attr) => {
        const [key, val] = attr;
        container.setAttribute(key, val);
      });
    };
    return [element, updateAttrs];
  }

  // src/app/lib/KeyFrames.ts
  function uuid2(str = "xxxxxxxx") {
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
  var useKeyFrames = (declarations) => {
    const id = uuid2();
    const style = document.createElement("style");
    style.id = id;
    document.getElementsByTagName("head")[0].appendChild(style);
    const render = () => {
      style.innerHTML = "";
      const styles = [];
      const declarationList = Object.entries(declarations).sort((a, b) => a[0] < b[0] ? -1 : 1);
      declarationList.forEach(([selector, declaration]) => {
        styles.push(`@keyframes ${selector}_${id} {
`);
        declaration.forEach(([percent, prop, val]) => styles.push(`${percent}% { ${prop}: ${val}; }
`));
        styles.push(`}
`);
      });
      style.innerHTML = styles.join("");
    };
    render();
    const getter = (...list) => list.map((item) => `${item}_${id}`).join(", ");
    const setter = (update) => {
      declarations = {...declarations, ...update};
      render();
    };
    return [getter, setter];
  };

  // src/app/lib/KeyPress.ts
  var useKeyPress = (cb) => {
    document.addEventListener("keyup", (e) => cb(e.code));
  };

  // src/app/lib/Palette.ts
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
  var usePalette = () => {
    const getter = (color, adjustLightness = 0, opacity = 1) => {
      if (color === "transparent")
        return color;
      const [h, s, l] = Colors[color];
      const hsla = `hsla(${h}deg,${s}%,${l + adjustLightness}%,${opacity})`;
      return hsla;
    };
    return [getter];
  };

  // src/app/lib/Property.ts
  var useProperty = (prop, callback) => {
    let property = prop;
    const getter = () => property;
    const setter = (prop2) => {
      property = prop2;
      if (callback)
        callback(property);
    };
    return [getter, setter];
  };

  // src/app/lib/FontFace.ts
  function uuid3(str = "xxxxxxxx") {
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
  var useFontFace = (fontFamily, src) => {
    const id = uuid3();
    const style = document.createElement("style");
    style.id = id;
    document.getElementsByTagName("head")[0].appendChild(style);
    const render = () => style.innerHTML = `@font-face { font-family: '${fontFamily}'; src: ${src};}`;
    render();
    return fontFamily;
  };

  // src/app/pages/spaces/Chill.ts
  var [palette] = usePalette();
  var anurati = useFontFace("anurati", `url('assets/Anurati-Regular.otf')`);
  var [css] = useCss({
    container: [
      ["backgroundColor", palette("brown")],
      ["color", palette("white")],
      ["display", "flex"],
      ["justifyContent", "center"],
      ["alignItems", "center"],
      ["fontFamily", "anurati"],
      ["fontSize", "60px"],
      ["letterSpacing", "40px"],
      ["paddingLeft", "40px"],
      ["width", "100%"],
      ["height", "100%"]
    ]
  });
  var useChillSpace = () => {
    const [container] = useHtml("div", ["class", css("container")]);
    return [container("CHILL")];
  };

  // src/app/pages/spaces/Deep.ts
  var [palette2] = usePalette();
  var anurati2 = useFontFace("anurati", `url('assets/Anurati-Regular.otf')`);
  var [css2] = useCss({
    container: [
      ["backgroundColor", palette2("black")],
      ["color", palette2("white")],
      ["display", "flex"],
      ["justifyContent", "center"],
      ["alignItems", "center"],
      ["fontFamily", "anurati"],
      ["fontSize", "60px"],
      ["letterSpacing", "40px"],
      ["paddingLeft", "40px"],
      ["width", "100%"],
      ["height", "100%"]
    ]
  });
  var useDeepSpace = () => {
    const [container] = useHtml("div", ["class", css2("container")]);
    return [container("DEEP")];
  };

  // src/app/pages/spaces/Think.ts
  var [palette3] = usePalette();
  var anurati3 = useFontFace("anurati", `url('assets/Anurati-Regular.otf')`);
  var [css3] = useCss({
    container: [
      ["backgroundColor", palette3("green", 0, 0.1)],
      ["color", palette3("white")],
      ["display", "flex"],
      ["justifyContent", "center"],
      ["alignItems", "center"],
      ["fontFamily", "anurati"],
      ["fontSize", "60px"],
      ["letterSpacing", "40px"],
      ["paddingLeft", "40px"],
      ["width", "100%"],
      ["height", "100%"]
    ]
  });
  var useThinkSpace = () => {
    const [container] = useHtml("div", ["class", css3("container")]);
    return [container("THINK")];
  };

  // src/app/pages/Escape.ts
  var [palette4] = usePalette();
  var [kf] = useKeyFrames({
    fadeIn: [
      [0, "opacity", 0],
      [100, "opacity", 1]
    ]
  });
  var [css4] = useCss({
    bg: [["backgroundColor", palette4("black")]],
    container: [
      ["display", "flex"],
      ["justifyContent", "center"],
      ["alignItems", "center"],
      ["height", "100vh"],
      ["width", "100vw"],
      ["position", "relative"]
    ],
    slider_container: [
      ["display", "flex"],
      ["justifyContent", "center"],
      ["alignItems", "center"],
      ["border", `1px solid ${palette4("white", 0, 0.1)}`],
      ["width", "90vw"],
      ["height", "90vh"],
      ["position", "absolute"],
      ["left", "5vw"]
    ],
    order_1: [
      ["order", "1"],
      ["left", "-100vw"],
      ["transition", "left 1s"]
    ],
    order_2: [
      ["order", "2"],
      ["left", "5vw"],
      ["transition", "left 1s"]
    ],
    order_3: [
      ["order", "3"],
      ["left", "100vw"]
    ]
  });
  var useEscapePage = () => {
    useDom("body", ["className", css4("bg")]);
    const [pub, sub] = useEvent();
    const [viewState, setViewState] = useProperty("INIT");
    const [container] = useHtml("div", ["class", css4("container")]);
    const [thinkSpace] = useThinkSpace();
    const [chillSpace] = useChillSpace();
    const [deepSpace] = useDeepSpace();
    const [think_container, setThinkAttrs] = useHtml("div", ["class", css4("slider_container", "order_2")]);
    const [chill_container, setChillAttrs] = useHtml("div", ["class", css4("slider_container", "order_3")]);
    const [deep_container, setDeepAttrs] = useHtml("div", ["class", css4("slider_container", "order_1")]);
    useKeyPress((key) => {
      console.log(key);
      switch (key) {
        case "Space":
          pub("NEXT");
          break;
      }
    });
    sub("NEXT", () => machine("NEXT"));
    const machine = (event) => {
      console.log(event, viewState());
      switch (viewState()) {
        case "INIT":
          setViewState("THINK");
          return [container(think_container(thinkSpace), chill_container(chillSpace), deep_container(deepSpace))];
        case "THINK":
          if (event === "NEXT") {
            setViewState("CHILL");
            setChillAttrs(["class", css4("slider_container", "order_2")]);
            setDeepAttrs(["class", css4("slider_container", "order_3")]);
            setThinkAttrs(["class", css4("slider_container", "order_1")]);
          }
          break;
        case "CHILL":
          if (event === "NEXT") {
            setViewState("DEEP");
            setDeepAttrs(["class", css4("slider_container", "order_2")]);
            setThinkAttrs(["class", css4("slider_container", "order_3")]);
            setChillAttrs(["class", css4("slider_container", "order_1")]);
          }
          break;
        case "DEEP":
          if (event === "NEXT") {
            setViewState("THINK");
            setThinkAttrs(["class", css4("slider_container", "order_2")]);
            setDeepAttrs(["class", css4("slider_container", "order_1")]);
            setChillAttrs(["class", css4("slider_container", "order_3")]);
          }
          break;
      }
    };
    return machine("START");
  };

  // src/main.ts
  window.addEventListener("DOMContentLoaded", async () => {
    const resetStyle = `margin:0px;padding:0px;width:100vw;height:100vh;`;
    const [body] = useDom("body", ["style", resetStyle]);
    const [escapePage] = useEscapePage();
    body(escapePage);
  });
})();
//# sourceMappingURL=app.js.map
