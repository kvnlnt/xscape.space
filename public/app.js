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
    container: [
      ["display", "flex"],
      ["justifyContent", "center"],
      ["alignItems", "center"],
      ["height", "100vh"],
      ["width", "100vw"],
      ["position", "relative"],
      ["overflow", "hidden"]
    ],
    slider_container: [
      ["display", "flex"],
      ["justifyContent", "center"],
      ["alignItems", "center"],
      ["width", "100vw"],
      ["height", "100vh"],
      ["position", "absolute"]
    ]
  });
  var useSlider = (slides, cb) => {
    const [container] = useHtml("div", ["class", css("container")]);
    const createSlide = ({name, element}) => {
      const [container2, setContainerAttrs] = useHtml("div", ["class", css("slider_container")]);
      return [container2(element), setContainerAttrs, name];
    };
    const slideMap = slides.map(createSlide);
    const slideMedianIndex = Math.floor(slides.length / 2);
    const shiftToEnd = (a) => a.push(a.shift());
    const shiftToFront = (a) => a.unshift(a.pop());
    const prevSlide = () => slideMap[slideMedianIndex - 1];
    const currSlide = () => slideMap[slideMedianIndex];
    const nextSlide = () => slideMap[slideMedianIndex + 1];
    const slide = (event = "INIT") => {
      if (event === "NEXT")
        shiftToEnd(slideMap);
      if (event === "PREV")
        shiftToFront(slideMap);
      slideMap.forEach((slide2) => {
        const shouldShow = [prevSlide()[2], currSlide()[2], nextSlide()[2]].includes(slide2[2]);
        if (!shouldShow)
          slide2[1](["style", "display:none"]);
      });
      prevSlide()[1](["style", `order:1;left:-100vw;${event === "NEXT" ? "transition:left ease-in-out 1s" : ""}`]);
      currSlide()[1](["style", `order:2;left:0vw;transition:left ease-in-out 1s`]);
      nextSlide()[1](["style", `order:3;left:100vw;${event === "PREV" ? "transition:left ease-in-out 1s" : ""}`]);
      const slidingOut = event === "NEXT" ? prevSlide()[2] : nextSlide()[2];
      const slidingIn = currSlide()[2];
      cb({slidingIn, slidingOut});
    };
    const machine = (event = "INIT") => {
      switch (event) {
        case "INIT":
          slide();
          break;
        case "NEXT":
          slide("NEXT");
          break;
        case "PREV":
          slide("PREV");
          break;
      }
    };
    return [container(...slideMap.map(([slide2]) => slide2)), machine];
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
        declaration.forEach(([percent, prop, val]) => styles.push(`${percent}% { ${prop.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${val}; }
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
  var useKeyPress = () => {
    const subscriptions = [];
    document.addEventListener("keyup", (e) => {
      subscriptions.filter((s) => s.key === e.code).forEach((s) => s.callback());
    });
    const sub = (key, callback) => subscriptions.push({
      key,
      callback
    });
    return [sub];
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

  // src/app/components/spaces/Chill.ts
  var [palette2] = usePalette();
  useFontFace("anurati", `url('assets/Anurati-Regular.otf')`);
  var [kf] = useKeyFrames({
    fade_in: [
      [0, "opacity", 0],
      [100, "opacity", 1]
    ],
    fade_out: [
      [0, "opacity", 1],
      [100, "opacity", 0]
    ],
    container_zoom_width_in: [
      [0, "width", "90vw"],
      [100, "width", "100vw"]
    ],
    container_zoom_width_out: [
      [0, "width", "100vw"],
      [100, "width", "90vw"]
    ],
    container_zoom_height_in: [
      [0, "height", "90vh"],
      [100, "height", "100vh"]
    ],
    container_zoom_height_out: [
      [0, "height", "100vh"],
      [100, "height", "90vh"]
    ]
  });
  var [css2] = useCss({
    container: [
      ["backgroundColor", palette2("white", 0, 0.05)],
      ["color", palette2("white")],
      ["display", "flex"],
      ["justifyContent", "center"],
      ["alignItems", "center"],
      ["width", "90vw"],
      ["height", "90vh"],
      ["border", `1px solid ${palette2("white", 0, 0.1)}`],
      ["flexDirection", "column"]
    ],
    container_active: [
      ["animation", kf("container_zoom_width_in", "container_zoom_height_in")],
      ["animationFillMode", "forwards"],
      ["animationDuration", "0.5s"]
    ],
    container_deactive: [
      ["animation", kf("container_zoom_width_out", "container_zoom_height_out")],
      ["animationFillMode", "forwards"],
      ["animationDuration", "0.5s"]
    ],
    enter_button: [
      ["fontFamily", "anurati"],
      ["fontSize", "10px"],
      ["marginTop", "40px"],
      ["opacity", "0"],
      ["padding", "20px"],
      ["backgroundColor", palette2("white", 0, 0.01)],
      ["color", palette2("white")],
      ["border", `1px dashed ${palette2("white", 0, 0.1)}`],
      ["cursor", "pointer"],
      ["letterSpacing", "4px"]
    ],
    enter_button_transition_in: [
      ["animation", kf("fade_in")],
      ["animationFillMode", "forwards"],
      ["animationDuration", "0.5s"]
    ],
    enter_button_transition_out: [
      ["animation", kf("fade_out")],
      ["animationFillMode", "forwards"],
      ["animationDuration", "0.5s"]
    ],
    font_big: [["fontSize", "66px"]],
    sub_title: [
      ["fontFamily", "anurati"],
      ["fontSize", "10px"],
      ["letterSpacing", "40px"],
      ["paddingLeft", "40px"],
      ["marginTop", "40px"],
      ["opacity", "0"]
    ],
    sub_title_transition_in: [
      ["animation", kf("fade_in")],
      ["animationFillMode", "forwards"],
      ["animationDuration", "0.5s"]
    ],
    sub_title_transition_out: [
      ["animation", kf("fade_out")],
      ["animationFillMode", "forwards"],
      ["animationDuration", "0.5s"]
    ],
    title: [
      ["fontFamily", "anurati"],
      ["fontSize", "24px"],
      ["letterSpacing", "40px"],
      ["paddingLeft", "40px"],
      ["opacity", "0"],
      ["transition", "all 0.5s"]
    ],
    title_transition_in: [
      ["animation", kf("fade_in")],
      ["animationFillMode", "forwards"],
      ["animationDuration", "0.5s"]
    ],
    title_transition_out: [
      ["animation", kf("fade_out")],
      ["animationFillMode", "forwards"],
      ["animationDuration", "0.5s"]
    ],
    transition_bar: [
      ["position", "fixed"],
      ["backgroundColor", palette2("white")],
      ["top", "50vh"],
      ["height", "0vh"],
      ["width", "100vw"],
      ["transition", "all 0.5s"]
    ],
    transition_bar_in: [
      ["top", "50vh"],
      ["height", "0vh"],
      ["transition", "all 0.5s"]
    ],
    transition_bar_out: [
      ["top", "45vh"],
      ["height", "10vh"],
      ["transition", "all 0.5s"]
    ]
  });
  var useChillSpace = ({
    onActivation,
    onDeactivation
  }) => {
    const [keypress] = useKeyPress();
    const [state, setState] = useProperty("PASSIVE");
    const [container, containerAttrs] = useHtml("div", ["class", css2("container")]);
    const [title, titleAttrs] = useHtml("div", ["class", css2("title", "font_big_on_tablet")]);
    const [subtitle, subtitleAttrs] = useHtml("div", ["class", css2("sub_title")]);
    const [transitionBar, transitionBarAttrs] = useHtml("div", ["class", css2("transition_bar")]);
    const [enterButton, enterButtonAttrs] = useHtml("button", ["class", css2("enter_button")], ["onclick", () => machine("ACTIVATE")]);
    keypress("Escape", () => machine("DEACTIVATE"));
    const activate = () => {
      containerAttrs(["class", css2("container", "container_active")]);
    };
    const deactivate = () => {
      containerAttrs(["class", css2("container", "container_deactive")]);
    };
    const slideInAnimation = () => {
      titleAttrs(["class", css2("title", "title_transition_in", "font_big_on_tablet")]);
      subtitleAttrs(["class", css2("sub_title", "sub_title_transition_in")]);
      enterButtonAttrs(["class", css2("enter_button", "enter_button_transition_in")]);
    };
    const slideOutAnimation = () => {
      titleAttrs(["class", css2("title", "font_big_on_tablet", "title_transition_out")]);
      subtitleAttrs(["class", css2("sub_title", "sub_title_transition_out")]);
      enterButtonAttrs(["class", css2("enter_button", "enter_button_transition_out")]);
    };
    const machine = (event) => {
      console.log(event, state());
      switch (state()) {
        case "PASSIVE":
          switch (event) {
            case "SLIDE_IN":
              slideInAnimation();
              break;
            case "SLIDE_OUT":
              slideOutAnimation();
              break;
            case "ACTIVATE":
              activate();
              if (onActivation)
                onActivation();
              setState("ACTIVE");
              break;
          }
          break;
        case "ACTIVE":
          switch (event) {
            case "DEACTIVATE":
              deactivate();
              if (onDeactivation)
                onDeactivation();
              setState("PASSIVE");
              break;
          }
          break;
      }
    };
    return [container(title("CHILL"), subtitle("SPACE"), enterButton("[ ESC ]"), transitionBar()), machine];
  };

  // src/app/components/spaces/Deep.ts
  var [palette3] = usePalette();
  useFontFace("anurati", `url('assets/Anurati-Regular.otf')`);
  var [kf2] = useKeyFrames({
    fade_in: [
      [0, "opacity", 0],
      [100, "opacity", 1]
    ],
    fade_out: [
      [0, "opacity", 1],
      [100, "opacity", 0]
    ],
    container_zoom_width_in: [
      [0, "width", "90vw"],
      [100, "width", "100vw"]
    ],
    container_zoom_width_out: [
      [0, "width", "100vw"],
      [100, "width", "90vw"]
    ],
    container_zoom_height_in: [
      [0, "height", "90vh"],
      [100, "height", "100vh"]
    ],
    container_zoom_height_out: [
      [0, "height", "100vh"],
      [100, "height", "90vh"]
    ]
  });
  var [css3] = useCss({
    container: [
      ["backgroundColor", palette3("white", 0, 0.05)],
      ["color", palette3("white")],
      ["display", "flex"],
      ["justifyContent", "center"],
      ["alignItems", "center"],
      ["width", "90vw"],
      ["height", "90vh"],
      ["border", `1px solid ${palette3("white", 0, 0.1)}`],
      ["flexDirection", "column"]
    ],
    container_active: [
      ["animation", kf2("container_zoom_width_in", "container_zoom_height_in")],
      ["animationFillMode", "forwards"],
      ["animationDuration", "0.5s"]
    ],
    container_deactive: [
      ["animation", kf2("container_zoom_width_out", "container_zoom_height_out")],
      ["animationFillMode", "forwards"],
      ["animationDuration", "0.5s"]
    ],
    enter_button: [
      ["fontFamily", "anurati"],
      ["fontSize", "10px"],
      ["marginTop", "40px"],
      ["opacity", "0"],
      ["padding", "20px"],
      ["backgroundColor", palette3("white", 0, 0.01)],
      ["color", palette3("white")],
      ["border", `1px dashed ${palette3("white", 0, 0.1)}`],
      ["cursor", "pointer"],
      ["letterSpacing", "4px"]
    ],
    enter_button_transition_in: [
      ["animation", kf2("fade_in")],
      ["animationFillMode", "forwards"],
      ["animationDuration", "0.5s"]
    ],
    enter_button_transition_out: [
      ["animation", kf2("fade_out")],
      ["animationFillMode", "forwards"],
      ["animationDuration", "0.5s"]
    ],
    font_big: [["fontSize", "66px"]],
    sub_title: [
      ["fontFamily", "anurati"],
      ["fontSize", "10px"],
      ["letterSpacing", "40px"],
      ["paddingLeft", "40px"],
      ["marginTop", "40px"],
      ["opacity", "0"]
    ],
    sub_title_transition_in: [
      ["animation", kf2("fade_in")],
      ["animationFillMode", "forwards"],
      ["animationDuration", "0.5s"]
    ],
    sub_title_transition_out: [
      ["animation", kf2("fade_out")],
      ["animationFillMode", "forwards"],
      ["animationDuration", "0.5s"]
    ],
    title: [
      ["fontFamily", "anurati"],
      ["fontSize", "24px"],
      ["letterSpacing", "40px"],
      ["paddingLeft", "40px"],
      ["opacity", "0"],
      ["transition", "all 0.5s"]
    ],
    title_transition_in: [
      ["animation", kf2("fade_in")],
      ["animationFillMode", "forwards"],
      ["animationDuration", "0.5s"]
    ],
    title_transition_out: [
      ["animation", kf2("fade_out")],
      ["animationFillMode", "forwards"],
      ["animationDuration", "0.5s"]
    ],
    transition_bar: [
      ["position", "fixed"],
      ["backgroundColor", palette3("white")],
      ["top", "50vh"],
      ["height", "0vh"],
      ["width", "100vw"],
      ["transition", "all 0.5s"]
    ],
    transition_bar_in: [
      ["top", "50vh"],
      ["height", "0vh"],
      ["transition", "all 0.5s"]
    ],
    transition_bar_out: [
      ["top", "45vh"],
      ["height", "10vh"],
      ["transition", "all 0.5s"]
    ]
  });
  var useDeepSpace = ({
    onActivation,
    onDeactivation
  }) => {
    const [keypress] = useKeyPress();
    const [state, setState] = useProperty("PASSIVE");
    const [container, containerAttrs] = useHtml("div", ["class", css3("container")]);
    const [title, titleAttrs] = useHtml("div", ["class", css3("title", "font_big_on_tablet")]);
    const [subtitle, subtitleAttrs] = useHtml("div", ["class", css3("sub_title")]);
    const [transitionBar, transitionBarAttrs] = useHtml("div", ["class", css3("transition_bar")]);
    const [enterButton, enterButtonAttrs] = useHtml("button", ["class", css3("enter_button")], ["onclick", () => machine("ACTIVATE")]);
    keypress("Escape", () => machine("DEACTIVATE"));
    const activate = () => {
      containerAttrs(["class", css3("container", "container_active")]);
    };
    const deactivate = () => {
      containerAttrs(["class", css3("container", "container_deactive")]);
    };
    const slideInAnimation = () => {
      titleAttrs(["class", css3("title", "title_transition_in", "font_big_on_tablet")]);
      subtitleAttrs(["class", css3("sub_title", "sub_title_transition_in")]);
      enterButtonAttrs(["class", css3("enter_button", "enter_button_transition_in")]);
    };
    const slideOutAnimation = () => {
      titleAttrs(["class", css3("title", "font_big_on_tablet", "title_transition_out")]);
      subtitleAttrs(["class", css3("sub_title", "sub_title_transition_out")]);
      enterButtonAttrs(["class", css3("enter_button", "enter_button_transition_out")]);
    };
    const machine = (event) => {
      console.log(event, state());
      switch (state()) {
        case "PASSIVE":
          switch (event) {
            case "SLIDE_IN":
              slideInAnimation();
              break;
            case "SLIDE_OUT":
              slideOutAnimation();
              break;
            case "ACTIVATE":
              activate();
              if (onActivation)
                onActivation();
              setState("ACTIVE");
              break;
          }
          break;
        case "ACTIVE":
          switch (event) {
            case "DEACTIVATE":
              deactivate();
              if (onDeactivation)
                onDeactivation();
              setState("PASSIVE");
              break;
          }
          break;
      }
    };
    return [container(title("DEEP"), subtitle("SPACE"), enterButton("[ ESC ]"), transitionBar()), machine];
  };

  // src/app/components/spaces/Think.ts
  var [palette4] = usePalette();
  useFontFace("anurati", `url('assets/Anurati-Regular.otf')`);
  var [kf3] = useKeyFrames({
    fade_in: [
      [0, "opacity", 0],
      [100, "opacity", 1]
    ],
    fade_out: [
      [0, "opacity", 1],
      [100, "opacity", 0]
    ],
    container_zoom_width_in: [
      [0, "width", "90vw"],
      [100, "width", "100vw"]
    ],
    container_zoom_width_out: [
      [0, "width", "100vw"],
      [100, "width", "90vw"]
    ],
    container_zoom_height_in: [
      [0, "height", "90vh"],
      [100, "height", "100vh"]
    ],
    container_zoom_height_out: [
      [0, "height", "100vh"],
      [100, "height", "90vh"]
    ]
  });
  var [css4] = useCss({
    container: [
      ["backgroundColor", palette4("white", 0, 0.05)],
      ["color", palette4("white")],
      ["display", "flex"],
      ["justifyContent", "center"],
      ["alignItems", "center"],
      ["width", "90vw"],
      ["height", "90vh"],
      ["border", `1px solid ${palette4("white", 0, 0.1)}`],
      ["flexDirection", "column"]
    ],
    container_active: [
      ["animation", kf3("container_zoom_width_in", "container_zoom_height_in")],
      ["animationFillMode", "forwards"],
      ["animationDuration", "0.5s"]
    ],
    container_deactive: [
      ["animation", kf3("container_zoom_width_out", "container_zoom_height_out")],
      ["animationFillMode", "forwards"],
      ["animationDuration", "0.5s"]
    ],
    enter_button: [
      ["fontFamily", "anurati"],
      ["fontSize", "10px"],
      ["marginTop", "40px"],
      ["opacity", "0"],
      ["padding", "20px"],
      ["backgroundColor", palette4("white", 0, 0.01)],
      ["color", palette4("white")],
      ["border", `1px dashed ${palette4("white", 0, 0.1)}`],
      ["cursor", "pointer"],
      ["letterSpacing", "4px"]
    ],
    enter_button_transition_in: [
      ["animation", kf3("fade_in")],
      ["animationFillMode", "forwards"],
      ["animationDuration", "0.5s"]
    ],
    enter_button_transition_out: [
      ["animation", kf3("fade_out")],
      ["animationFillMode", "forwards"],
      ["animationDuration", "0.5s"]
    ],
    font_big: [["fontSize", "66px"]],
    sub_title: [
      ["fontFamily", "anurati"],
      ["fontSize", "10px"],
      ["letterSpacing", "40px"],
      ["paddingLeft", "40px"],
      ["marginTop", "40px"],
      ["opacity", "0"]
    ],
    sub_title_transition_in: [
      ["animation", kf3("fade_in")],
      ["animationFillMode", "forwards"],
      ["animationDuration", "0.5s"]
    ],
    sub_title_transition_out: [
      ["animation", kf3("fade_out")],
      ["animationFillMode", "forwards"],
      ["animationDuration", "0.5s"]
    ],
    title: [
      ["fontFamily", "anurati"],
      ["fontSize", "24px"],
      ["letterSpacing", "40px"],
      ["paddingLeft", "40px"],
      ["opacity", "0"],
      ["transition", "all 0.5s"]
    ],
    title_transition_in: [
      ["animation", kf3("fade_in")],
      ["animationFillMode", "forwards"],
      ["animationDuration", "0.5s"]
    ],
    title_transition_out: [
      ["animation", kf3("fade_out")],
      ["animationFillMode", "forwards"],
      ["animationDuration", "0.5s"]
    ],
    transition_bar: [
      ["position", "fixed"],
      ["backgroundColor", palette4("white")],
      ["top", "50vh"],
      ["height", "0vh"],
      ["width", "100vw"],
      ["transition", "all 0.5s"]
    ],
    transition_bar_in: [
      ["top", "50vh"],
      ["height", "0vh"],
      ["transition", "all 0.5s"]
    ],
    transition_bar_out: [
      ["top", "45vh"],
      ["height", "10vh"],
      ["transition", "all 0.5s"]
    ]
  });
  var useThinkSpace = ({
    onActivation,
    onDeactivation
  }) => {
    const [keypress] = useKeyPress();
    const [state, setState] = useProperty("PASSIVE");
    const [container, containerAttrs] = useHtml("div", ["class", css4("container")]);
    const [title, titleAttrs] = useHtml("div", ["class", css4("title", "font_big_on_tablet")]);
    const [subtitle, subtitleAttrs] = useHtml("div", ["class", css4("sub_title")]);
    const [transitionBar, transitionBarAttrs] = useHtml("div", ["class", css4("transition_bar")]);
    const [enterButton, enterButtonAttrs] = useHtml("button", ["class", css4("enter_button")], ["onclick", () => machine("ACTIVATE")]);
    keypress("Escape", () => machine("DEACTIVATE"));
    const activate = () => {
      containerAttrs(["class", css4("container", "container_active")]);
    };
    const deactivate = () => {
      containerAttrs(["class", css4("container", "container_deactive")]);
    };
    const slideInAnimation = () => {
      titleAttrs(["class", css4("title", "title_transition_in", "font_big_on_tablet")]);
      subtitleAttrs(["class", css4("sub_title", "sub_title_transition_in")]);
      enterButtonAttrs(["class", css4("enter_button", "enter_button_transition_in")]);
    };
    const slideOutAnimation = () => {
      titleAttrs(["class", css4("title", "font_big_on_tablet", "title_transition_out")]);
      subtitleAttrs(["class", css4("sub_title", "sub_title_transition_out")]);
      enterButtonAttrs(["class", css4("enter_button", "enter_button_transition_out")]);
    };
    const machine = (event) => {
      console.log(event, state());
      switch (state()) {
        case "PASSIVE":
          switch (event) {
            case "SLIDE_IN":
              slideInAnimation();
              break;
            case "SLIDE_OUT":
              slideOutAnimation();
              break;
            case "ACTIVATE":
              activate();
              if (onActivation)
                onActivation();
              setState("ACTIVE");
              break;
          }
          break;
        case "ACTIVE":
          switch (event) {
            case "DEACTIVATE":
              deactivate();
              if (onDeactivation)
                onDeactivation();
              setState("PASSIVE");
              break;
          }
          break;
      }
    };
    return [container(title("THINK"), subtitle("SPACE"), enterButton("[ ESC ]"), transitionBar()), machine];
  };

  // src/app/lib/Swipe.ts
  var useSwipe = () => {
    const subscriptions = [];
    document.addEventListener("touchstart", handleTouchStart, false);
    document.addEventListener("touchmove", handleTouchMove, false);
    let xDown = null;
    let yDown = null;
    function handleTouchStart(evt) {
      const firstTouch = evt.touches[0];
      xDown = firstTouch.clientX;
      yDown = firstTouch.clientY;
    }
    function handleTouchMove(evt) {
      if (!xDown || !yDown)
        return;
      let xUp = evt.touches[0].clientX;
      let yUp = evt.touches[0].clientY;
      let xDiff = xDown - xUp;
      let yDiff = yDown - yUp;
      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        subscriptions.forEach((cb) => {
          if (xDiff > 0) {
            if (cb.direction === "RIGHT")
              cb.callback();
          } else {
            if (cb.direction === "LEFT")
              cb.callback();
          }
        });
      } else {
        subscriptions.forEach((cb) => {
          if (yDiff > 0) {
            if (cb.direction === "DOWN")
              cb.callback();
          } else {
            if (cb.direction === "UP")
              cb.callback();
          }
        });
      }
      xDown = null;
      yDown = null;
    }
    const sub = (direction, subscription) => subscriptions.push({
      direction,
      callback: subscription
    });
    return [sub];
  };

  // src/app/pages/Escape.ts
  var [palette5] = usePalette();
  var [css5] = useCss({
    body: [
      ["backgroundColor", palette5("black")],
      ["overflow", "hidden"]
    ],
    container: [
      ["width", "100vw"],
      ["height", "100vh"]
    ],
    transition_bar: [
      ["position", "fixed"],
      ["backgroundColor", palette5("purple", 0, 0.01)],
      ["top", "-25vh"],
      ["left", "-25vw"],
      ["height", "150vh"],
      ["width", "150vw"],
      ["transition", "all 0.5s"],
      ["borderRadius", "100%"]
    ],
    transition_bar_in: [
      ["top", "50vh"],
      ["left", "50vw"],
      ["height", "0vw"],
      ["width", "0vw"],
      ["transition", "all 0.5s"],
      ["borderRadius", "100vw"],
      ["transform", "rotate(720deg)"]
    ],
    transition_bar_out: [
      ["top", "-25vh"],
      ["left", "-25vw"],
      ["height", "150vh"],
      ["width", "150vw"],
      ["transition", "all 0.5s"]
    ]
  });
  var useEscapePage = (parent) => {
    useDom("body", ["className", css5("body")]);
    const [swipe] = useSwipe();
    const [keypress] = useKeyPress();
    const [state, setState] = useProperty("INIT");
    const [currentSlide, setCurrentSlide] = useProperty("THINK");
    const [container] = useHtml("div", ["class", css5("container")]);
    const [transitionBar, transitionBarAttrs] = useHtml("div", ["class", css5("transition_bar")]);
    const [transitionBar2, transitionBarAttrs2] = useHtml("div", ["class", css5("transition_bar")], ["style", "transition-delay:0.05s"]);
    const [thinkSpace, thinkMachine] = useThinkSpace({
      onActivation: () => machine("ESCAPE_TO_THINK_SPACE"),
      onDeactivation: () => machine("ESCAPE")
    });
    const [chillSpace, chillMachine] = useChillSpace({
      onActivation: () => machine("ESCAPE_TO_CHILL_SPACE"),
      onDeactivation: () => machine("ESCAPE")
    });
    const [deepSpace, deepMachine] = useDeepSpace({
      onActivation: () => machine("ESCAPE_TO_DEEP_SPACE"),
      onDeactivation: () => machine("ESCAPE")
    });
    const [slides, slider] = useSlider([
      {name: "DEEP", element: deepSpace},
      {name: "THINK", element: thinkSpace},
      {name: "CHILL", element: chillSpace}
    ], ({slidingIn, slidingOut}) => {
      if (slidingOut === "THINK")
        thinkMachine("SLIDE_OUT");
      if (slidingIn === "THINK")
        setTimeout(() => thinkMachine("SLIDE_IN"), 750);
      if (slidingOut === "CHILL")
        chillMachine("SLIDE_OUT");
      if (slidingIn === "CHILL")
        setTimeout(() => chillMachine("SLIDE_IN"), 750);
      if (slidingOut === "DEEP")
        deepMachine("SLIDE_OUT");
      if (slidingIn === "DEEP")
        setTimeout(() => deepMachine("SLIDE_IN"), 750);
      transitionBarAttrs(["class", css5("transition_bar", "transition_bar_out")]);
      transitionBarAttrs2(["class", css5("transition_bar", "transition_bar_out")]);
      setTimeout(() => {
        transitionBarAttrs(["class", css5("transition_bar", "transition_bar_in")]);
        transitionBarAttrs2(["class", css5("transition_bar", "transition_bar_in")]);
      }, 1e3);
      setCurrentSlide(slidingIn);
    });
    swipe("RIGHT", () => machine("NEXT_SLIDE"));
    swipe("LEFT", () => machine("PREV_SLIDE"));
    keypress("ArrowRight", () => machine("NEXT_SLIDE"));
    keypress("ArrowLeft", () => machine("PREV_SLIDE"));
    const machine = (event = null) => {
      switch (state()) {
        case "INIT":
          parent(container(slides, transitionBar(), transitionBar2()));
          slider("INIT");
          setState("SEARCHING");
          break;
        case "SEARCHING":
          switch (event) {
            case "NEXT_SLIDE":
              slider("NEXT");
              break;
            case "PREV_SLIDE":
              slider("PREV");
              break;
            case "ESCAPE_TO_THINK_SPACE":
              setState("THINKING");
              break;
            case "ESCAPE_TO_CHILL_SPACE":
              setState("CHILLING");
              break;
            case "ESCAPE_TO_DEEP_SPACE":
              setState("IN_DEEP");
              break;
          }
          break;
        case "THINKING":
        case "CHILLING":
        case "IN_DEEP":
          switch (event) {
            case "ESCAPE":
              setState("SEARCHING");
              break;
          }
      }
    };
    machine();
  };

  // src/main.ts
  window.addEventListener("DOMContentLoaded", async () => {
    const resetStyle = `margin:0px;padding:0px;width:100vw;height:100vh;`;
    const [body] = useDom("body", ["style", resetStyle]);
    useEscapePage(body);
  });
})();
//# sourceMappingURL=app.js.map
