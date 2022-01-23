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

  // src/app/components/Slider.ts
  var [palette] = usePalette();
  var [css] = useCss({
    slider_container: [
      ["display", "flex"],
      ["justifyContent", "center"],
      ["alignItems", "center"],
      ["border", `1px solid ${palette("white", 0, 0.1)}`],
      ["width", "90vw"],
      ["height", "90vh"],
      ["position", "absolute"]
    ]
  });
  var useSlider = (...slides) => {
    const slideMap = slides.map(({name, element}) => {
      const [container, setContainerAttrs] = useHtml("div", ["class", css("slider_container")]);
      return [container(element), setContainerAttrs, name];
    });
    const slideMedianIndex = Math.floor(slides.length / 2);
    const shiftToEnd = (a) => a.push(a.shift());
    const shiftToFront = (a) => a.unshift(a.pop());
    const prevSlide = () => slideMap[slideMedianIndex - 1];
    const currSlide = () => slideMap[slideMedianIndex];
    const nextSlide = () => slideMap[slideMedianIndex + 1];
    useKeyPress((key) => {
      console.log(key);
      switch (key) {
        case "ArrowRight":
        case "Space":
          machine("NEXT");
          break;
        case "ArrowLeft":
          machine("PREV");
          break;
      }
    });
    const machine = (event = "NONE") => {
      switch (event) {
        case "NEXT":
          shiftToEnd(slideMap);
          break;
        case "PREV":
          shiftToFront(slideMap);
          break;
      }
      slideMap.forEach((slide) => {
        const shouldShow = [prevSlide()[2], currSlide()[2], nextSlide()[2]].includes(slide[2]);
        if (!shouldShow)
          slide[1](["style", "display:none"]);
      });
      prevSlide()[1](["style", `order:1;left:-110vw;${event === "NEXT" ? "transition:left ease-in-out 1s" : null}`]);
      currSlide()[1](["style", `order:2;left:5vw;transition:left ease-in-out 1s`]);
      nextSlide()[1](["style", `order:3;left:110vw;${event === "PREV" ? "transition:left ease-in-out 1s" : null}`]);
    };
    machine();
    return [slideMap.map(([slide]) => slide)];
  };

  // src/app/lib/FontFace.ts
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
  var useFontFace = (fontFamily, src) => {
    const id = uuid2();
    const style = document.createElement("style");
    style.id = id;
    document.getElementsByTagName("head")[0].appendChild(style);
    const render = () => style.innerHTML = `@font-face {font-family:'${fontFamily}'; src: ${src};}`;
    render();
    return fontFamily;
  };

  // src/app/components/spaces/Chill.ts
  var [palette2] = usePalette();
  var anurati = useFontFace("anurati", `url('assets/Anurati-Regular.otf')`);
  var [css2] = useCss({
    container: [
      ["backgroundColor", palette2("brown")],
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
  var useChillSpace = () => {
    const [container] = useHtml("div", ["class", css2("container")]);
    return [container("CHILL")];
  };

  // src/app/components/spaces/Deep.ts
  var [palette3] = usePalette();
  var anurati2 = useFontFace("anurati", `url('assets/Anurati-Regular.otf')`);
  var [css3] = useCss({
    container: [
      ["backgroundColor", palette3("black")],
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
  var useDeepSpace = () => {
    const [container] = useHtml("div", ["class", css3("container")]);
    return [container("DEEP")];
  };

  // src/app/components/spaces/Think.ts
  var [palette4] = usePalette();
  var anurati3 = useFontFace("anurati", `url('assets/Anurati-Regular.otf')`);
  var [css4] = useCss({
    container: [
      ["backgroundColor", palette4("green", 0, 0.1)],
      ["color", palette4("white")],
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
    const [container] = useHtml("div", ["class", css4("container")]);
    return [container("THINK")];
  };

  // src/app/lib/KeyFrames.ts
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
  var useKeyFrames = (declarations) => {
    const id = uuid3();
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

  // src/app/pages/Escape.ts
  var [palette5] = usePalette();
  var [kf] = useKeyFrames({
    fadeIn: [
      [0, "opacity", 0],
      [100, "opacity", 1]
    ]
  });
  var [css5] = useCss({
    body: [
      ["backgroundColor", palette5("black")],
      ["overflow", "hidden"]
    ],
    container: [
      ["display", "flex"],
      ["justifyContent", "center"],
      ["alignItems", "center"],
      ["height", "100vh"],
      ["width", "100vw"],
      ["position", "relative"],
      ["overflow", "hidden"]
    ]
  });
  var useEscapePage = () => {
    useDom("body", ["className", css5("body")]);
    const [viewState] = useProperty("INIT");
    const [container] = useHtml("div", ["class", css5("container")]);
    const [thinkSpace] = useThinkSpace();
    const [chillSpace] = useChillSpace();
    const [deepSpace] = useDeepSpace();
    const [slides] = useSlider({name: "DEEP", element: deepSpace}, {name: "THINK", element: thinkSpace}, {name: "CHILL", element: chillSpace});
    const machine = () => {
      switch (viewState()) {
        case "INIT":
          return [container(...slides)];
      }
    };
    return machine();
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
