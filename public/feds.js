(() => {
  // src/app/lib/Dom.ts
  function useDom(selector) {
    let element = document.querySelector(selector);
    if (!element) {
      window.addEventListener("DOMContentLoaded", () => {
        element = document.querySelector(selector);
      });
    }
    const setter = (...children) => {
      element.innerHTML = "";
      children.forEach((child) => element.appendChild(child));
    };
    return [setter];
  }

  // src/app/lib/Palette.ts
  var Colors = {
    black: [0, 0, 5],
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
      return list.map((item) => `${item}_${id}`).join(" ");
    };
    const setter = (update) => {
      declarations = {...declarations, ...update};
      render();
    };
    return [getter, setter];
  };

  // src/app/lib/Svg.ts
  function SVG({tag, attrs = [], children = []}) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    attrs.forEach(([k, v]) => {
      if (typeof v === "function") {
        el.addEventListener(k.substring(2, k.length), (e) => v(e));
      } else if (typeof v === "boolean") {
        if (v === true)
          el.setAttribute(k, "");
      } else {
        el.setAttribute(k, v.toString());
      }
    });
    children.forEach((child) => {
      if (child instanceof Node)
        el.appendChild(child);
      if (typeof child === "string")
        el.innerHTML += child;
    });
    return el;
  }
  function useSvg(tag, ...attrs) {
    let container;
    const element = (...children) => {
      container = SVG({tag, attrs, children});
      return container;
    };
    const replace = (...children) => {
      const newContainer = SVG({tag, attrs, children});
      container.replaceWith(newContainer);
      container = newContainer;
    };
    const updateAttrs = (...attrs2) => {
      attrs2.forEach((attr) => {
        const [key, val] = attr;
        container.setAttribute(key, val);
      });
    };
    return [element, replace, updateAttrs];
  }

  // src/app/components/Branding/Mandala.ts
  var [palette] = usePalette();
  var [css] = useCss({
    whiteFill: [["fill", palette("white")]],
    whiteStroke: [["stroke", palette("white")]],
    text: [
      ["fontSize", "10px"],
      ["color", palette("white")]
    ]
  });
  var Transformer = {
    move(points, xOffset, yOffset) {
      return points.map(([x, y]) => [x + xOffset, y + yOffset]);
    },
    polarToCartesian(cx, cy, diameter, deg) {
      const radius = diameter / 2;
      var radian = (deg - 90) * Math.PI / 180;
      return [cx + radius * Math.cos(radian), cy + radius * Math.sin(radian)];
    },
    resize(points, scale) {
      const [p1x, p1y] = points[0];
      const [xOffset, yOffset] = [p1x * scale, p1y * scale];
      return points.map((point) => [point[0] * scale + xOffset, point[1] * scale + yOffset]);
    },
    rotate(points, angle) {
      const [cx, cy] = points[0];
      return points.map(([x, y]) => {
        const radians = Math.PI / 180 * -angle;
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        const nx = cos * (x - cx) + sin * (y - cy) + cx;
        const ny = cos * (y - cy) - sin * (x - cx) + cy;
        return [nx, ny];
      });
    }
  };
  var Renderer = {
    circle([x, y], fill) {
      const [circle] = useSvg("circle", ["cx", x], ["cy", y], ["r", 2], ["class", css("whiteFill")]);
      return circle();
    },
    polyline(points, stroke, strokeWidth, fill, close = true) {
      const closingPoint = close ? `${points[0][0]},${points[0][1]}` : null;
      const [polygon] = useSvg("polygon", ["points", `${points.map(([x, y]) => `${x},${y}`).join(" ")} ${closingPoint}`], ["style", `stroke:${stroke};fill:${fill};stroke-width:${strokeWidth};stroke-line-cap:round`]);
      return polygon();
    },
    text([x, y], txt) {
      const [text] = useSvg("text", ["x", x], ["y", y], ["class", css("text")]);
      return text(txt);
    }
  };
  var Bezier = class {
    constructor(props) {
      this.pointFrequency = 4;
      this.points = [];
      this.p1 = props.p1;
      this.p2 = props.p2;
      this.p3 = props.p3;
      this.p4 = props.p4;
      this.pointFrequency = props.pointFrequency;
      this.stroke = props.stroke;
      this.tIncrement = 1 / props.pointFrequency;
      this.calcT = this.calcT.bind(this);
      this.calcCoordsAtT = this.calcCoordsAtT.bind(this);
      this.render = this.render.bind(this);
      for (let i = 0; i < this.pointFrequency + 1; i++) {
        this.points.push(this.calcCoordsAtT(i * this.tIncrement));
      }
    }
    calcT(t, x1, y1, x2, y2) {
      const xOffset = x2 > x1 ? x2 : x1;
      const yOffset = y2 > y1 ? y2 : y1;
      const xT = x2 > x1 ? 1 - t : t;
      const yT = y2 > y1 ? 1 - t : t;
      const xDirection = x2 > x1 ? 1 : -1;
      const yDirection = y2 > y1 ? 1 : -1;
      const x = xOffset + xT * (x1 - x2) * xDirection;
      const y = yOffset + yT * (y1 - y2) * yDirection;
      return [x, y];
    }
    calcCoordsAtT(t) {
      const q1 = this.calcT(t, this.p1[0], this.p1[1], this.p2[0], this.p2[1]);
      const q2 = this.calcT(t, this.p2[0], this.p2[1], this.p3[0], this.p3[1]);
      const q3 = this.calcT(t, this.p3[0], this.p3[1], this.p4[0], this.p4[1]);
      const r1 = this.calcT(t, q1[0], q1[1], q2[0], q2[1]);
      const r2 = this.calcT(t, q2[0], q2[1], q3[0], q3[1]);
      return this.calcT(t, r1[0], r1[1], r2[0], r2[1]);
    }
    render(debug = true) {
      const circles = debug ? this.points.map((point) => Renderer.circle(point, this.stroke)) : null;
      const polyline = Renderer.polyline(this.points, this.stroke, this.fill, true);
      const [g] = useSvg("g");
      return g(...circles, polyline);
    }
  };
  var createContainer = () => {
    const [g] = useSvg("g", ["style", "pointer-events:none"]);
    return g();
  };
  var Mandala = class {
    constructor(props) {
      this.rotation = 0;
      this.rotationSpeed = 0.3;
      this.petalCalcs = [];
      this.state = "INIT";
      this.el = createContainer();
      this.cx = props.cx;
      this.cy = props.cy;
      this.debug = props.debug;
      this.diameter = props.diameter;
      this.fill = props.fill;
      this.petals = props.petals;
      this.stroke = props.stroke;
      this.strokeWidth = props.strokeWidth;
      this.petals = props.petals;
      this.rotation = props.rotation;
      this.rotationSpeed = props.rotationSpeed;
      this.on = props.on;
      this.msg({event: "INIT"});
    }
    msg(event) {
      switch (this.state) {
        case "INIT":
          switch (event.event) {
            case "INIT":
              this.state = "STATIC";
              this.calcPetals().render().registerEvents();
              break;
          }
        case "STATIC":
          switch (event.event) {
            case "ANIMATE":
              this.state = "ANIMATING";
              this.animate();
              break;
          }
        case "ANIMATING":
          switch (event.event) {
            case "STOP":
              this.state = "STATIC";
              break;
            case "ROTATE":
              this.calcPetals().render().registerEvents();
              break;
          }
      }
    }
    calcPetals() {
      const calcs = [];
      const angle = 360 / this.petals.length;
      const startingAngle = angle / 2;
      this.petals.forEach((petal, i) => {
        const petalAngle = angle * i + this.rotation;
        const nextAngle = angle * (i + 1) + this.rotation;
        const [x, y] = Transformer.polarToCartesian(this.cx, this.cy, this.diameter, petalAngle);
        const [nx, ny] = Transformer.polarToCartesian(this.cx, this.cy, this.diameter, nextAngle);
        const width = Math.hypot(nx - x, ny - y);
        const [p1, p2, p3, p4] = Transformer.rotate(Transformer.move([
          [0, 0],
          [width * petal.slope, petal.height],
          [width - width * petal.slope, petal.height],
          [width, 0]
        ], x, y), petalAngle + startingAngle);
        calcs.push({p1, p2, p3, p4, pointFrequency: petal.frequency, angle: petalAngle});
      });
      this.petalCalcs = calcs;
      return this;
    }
    registerEvents() {
      if (this.on?.mouseover)
        this.el.addEventListener("mouseenter", this.on.mouseover);
      if (this.on?.mouseleave && document.body)
        document.body.addEventListener("mouseout", this.on.mouseleave);
      if (this.on?.mouseleave && document.body)
        document.body.addEventListener("mouseleave", this.on.mouseleave);
      return this;
    }
    render() {
      this.el.innerHTML = "";
      if (this.on?.mouseover) {
        this.el.style.pointerEvents = "auto";
        this.el.style.cursor = "pointer";
      }
      const isPlaying = (angle) => angle % 360 >= 0 && angle % 360 <= 360 / (360 / this.rotationSpeed);
      const texts = this.petalCalcs.map((p) => Renderer.text([p.p1[0] - 20, p.p1[1] - 10], `${(p.angle % 360).toFixed(0)}`));
      const circles = this.petalCalcs.map((p) => Renderer.circle(p.p1, isPlaying(p.angle) ? palette("white") : this.stroke));
      const polyline = Renderer.polyline(this.petalCalcs.map(({p1, p2, p3, p4, pointFrequency, angle}) => new Bezier({p1, p2, p3, p4, pointFrequency, stroke: this.stroke}).points).flat(1), this.stroke, this.strokeWidth, this.fill, true);
      if (this.debug)
        circles.forEach((circle) => this.el.appendChild(circle));
      if (this.debug)
        texts.forEach((text) => this.el.appendChild(text));
      this.el.appendChild(polyline);
      return this;
    }
    animate() {
      const step = () => {
        this.rotation += this.rotationSpeed;
        if (this.state === "ANIMATING") {
          this.msg({event: "ROTATE"});
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  };
  var useMandala = (props) => {
    const mandala = new Mandala(props);
    return [mandala.el, mandala.msg.bind(mandala)];
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
      if (typeof child === "string")
        el.innerHTML += child;
    });
    return el;
  }
  function useHtml(tag, ...attrs) {
    let container;
    const element = (...children) => {
      container = HTML({tag, attrs, children});
      return container;
    };
    const replace = (...children) => {
      const newContainer = HTML({tag, attrs, children});
      container.replaceWith(newContainer);
      container = newContainer;
    };
    const updateAttrs = (...attrs2) => {
      attrs2.forEach((attr) => {
        const [key, val] = attr;
        container.setAttribute(key, val);
      });
    };
    return [element, replace, updateAttrs];
  }

  // src/app/components/Grids/IsoShell.ts
  var [palette2] = usePalette();
  var [css2] = useCss({
    grid: [
      ["display", "flex"],
      ["height", "100vh"],
      ["width", "100vw"],
      ["backgroundColor", palette2("black")],
      ["backgroundSize", "10px 10px"]
    ]
  });
  var useIsoShell = (content) => {
    const [Grid] = useHtml("div", ["class", css2("grid")]);
    return [Grid(content)];
  };

  // src/app/lib/Fonts.ts
  var Font;
  (function(Font2) {
    Font2["arial"] = "Arial";
  })(Font || (Font = {}));
  var useFont = () => {
    const getter = (font2) => Font[font2];
    return [getter];
  };

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

  // src/app/lib/Localization.ts
  var EN_US = {
    mainMenuHome: "Home",
    mainMenuDocs: "Docs",
    mainMenuLearn: "Learn",
    mainMenuShowcase: "Showcase",
    mainMenuGuestbook: "Guestbook",
    screenDocsTitle: "Docs",
    screenTitleHome: "Home",
    screenTitleComponent: "Components",
    screenLearnTitle: "Learn",
    screenShowcaseTitle: "Showcase",
    screenGuestbookTitle: "Guestbook"
  };
  var useLocalization = (lang = window.navigator.language) => {
    const getter = (key) => {
      let translation;
      switch (lang) {
        case "en-US":
          translation = EN_US;
          break;
        default:
          translation = EN_US;
          break;
      }
      return {...EN_US, ...translation}[key];
    };
    return [getter];
  };

  // src/app/lib/Math.ts
  function randomNumberInRange(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  var useMath = () => ({
    randomNumberInRange
  });

  // src/app/pages/SplashScreen.ts
  var [l10n] = useLocalization();
  var [palette3] = usePalette();
  var [font] = useFont();
  var [kf] = useKeyFrames({
    fadeIn: [
      [0, "opacity", 0],
      [100, "opacity", 1]
    ],
    slideDown: [
      [0, "transform", "translateY(-15px)"],
      [100, "transform", "translateY(0px)"]
    ],
    slideUp: [
      [0, "transform", "translateY(15px)"],
      [100, "transform", "translateY(0px)"]
    ],
    scaleUp: [
      [0, "transform", "scale(0.5)"],
      [100, "transform", "scale(1)"]
    ]
  });
  var [css3] = useCss({
    animationContainer: [
      ["color", palette3("white")],
      ["fontFamily", font("arial")],
      ["padding", "0px"],
      ["fontSize", "14px"],
      ["cursor", "pointer"]
    ],
    wrapper: [
      ["display", "flex"],
      ["width", "100vw"],
      ["justifyContent", "center"]
    ],
    container: [
      ["display", "flex"],
      ["flexDirection", "column"],
      ["justifyContent", "center"],
      ["alignItems", "center"],
      ["maxWidth", "500px"],
      ["animation", kf("fadeIn", "scaleUp")],
      ["animationFillMode", "forwards"],
      ["animationDuration", ".5s"],
      ["animationDelay", "0s"]
    ],
    title: [
      ["color", palette3("white")],
      ["fontFamily", font("arial")],
      ["fontWeight", "bold"],
      ["fontSize", "30px"],
      ["textTransform", "uppercase"],
      ["letterSpacing", "30px"],
      ["textAlign", "center"],
      ["marginBottom", "10px"],
      ["marginLeft", "30px"],
      ["animation", kf("slideUp", "fadeIn")],
      ["animationFillMode", "forwards"],
      ["animationDuration", "1s"],
      ["animationDelay", "0.25s"],
      ["opacity", 0]
    ],
    subTitle: [
      ["color", palette3("white", 0, 0.2)],
      ["fontFamily", font("arial")],
      ["fontSize", "10px"],
      ["textTransform", "uppercase"],
      ["letterSpacing", "5px"],
      ["textAlign", "center"],
      ["marginBottom", "0px"],
      ["animation", kf("slideUp", "fadeIn")],
      ["animationFillMode", "forwards"],
      ["animationDuration", "1s"],
      ["animationDelay", "0.5s"],
      ["opacity", 0]
    ],
    tagline: [
      ["color", palette3("white")],
      ["fontFamily", font("arial")],
      ["fontSize", "15px"],
      ["textTransform", "uppercase"],
      ["letterSpacing", "5px"],
      ["textAlign", "center"],
      ["lineHeight", "28px"],
      ["padding", "0px 30px 30px"],
      ["opacity", "0"],
      ["animationName", kf("slideUp", "fadeIn")],
      ["animationFillMode", "forwards"],
      ["animationDuration", "1s"],
      ["animationDelay", ".75s"]
    ],
    button: [
      ["backgroundColor", palette3("transparent")],
      ["color", palette3("white")],
      ["borderTop", "0px"],
      ["borderLeft", "0px"],
      ["borderRight", "0px"],
      ["borderBottom", `5px solid ${palette3("white", 0, 0.08)}`],
      ["padding", "15px 20px"],
      ["textTransform", "uppercase"],
      ["fontSize", "10px"],
      ["letterSpacing", "5px"],
      ["cursor", "pointer"],
      ["opacity", 0],
      ["animationName", kf("slideUp", "fadeIn")],
      ["animationFillMode", "forwards"],
      ["animationDuration", "1s"],
      ["animationDelay", "1s"]
    ],
    bg_white: [
      ["backgroundColor", palette3("white", 0, 0.1)],
      ["transition", "all 1s"]
    ],
    white_text: [
      ["color", palette3("white", 0, 0.75)],
      ["transition", "all 1s"]
    ],
    github_link: [
      ["color", palette3("white", 0, 0.2)],
      ["fontSize", "10px"],
      ["position", "fixed"],
      ["top", "20px"],
      ["right", "20px"],
      ["textDecoration", "none"],
      ["textTransform", "uppercase"],
      ["fontFamily", font("arial")],
      ["letterSpacing", "2px"],
      ["borderBottom", `1px dotted ${palette3("white", 0, 0.1)}`],
      ["display", "block"],
      ["padding", "5px"]
    ],
    fs_12: [
      ["fontSize", "12px"],
      ["lineHeight", "16px"]
    ],
    fs_15: [
      ["fontSize", "15px"],
      ["lineHeight", "26px"]
    ]
  });
  var {randomNumberInRange: randomNumberInRange2} = useMath();
  var getRandomColor = () => {
    const colors = [
      palette3("blue", 30, 0.7),
      palette3("red", 30, 0.7),
      palette3("yellow", 0, 0.7),
      palette3("green", 30, 0.7),
      palette3("purple", 30, 0.7),
      palette3("orange")
    ];
    return colors[randomNumberInRange2(0, colors.length - 1)];
  };
  var CanvasSize = 300;
  var createMandala = () => {
    const [Mandala2] = useSvg("svg", ["width", CanvasSize], ["height", CanvasSize]);
    const [RingOne, RingOneMessage] = useMandala({
      cx: CanvasSize / 2,
      cy: CanvasSize / 2,
      debug: false,
      diameter: CanvasSize * 0.75,
      fill: palette3("transparent"),
      stroke: getRandomColor(),
      petals: [
        ...Array(randomNumberInRange2(20, 50)).fill({
          height: randomNumberInRange2(0, 100),
          frequency: 20,
          slope: randomNumberInRange2(1, 5)
        })
      ],
      rotation: randomNumberInRange2(0, 90),
      rotationSpeed: 0.75,
      strokeWidth: "1"
    });
    const [RingTwo, RingTwoMessage] = useMandala({
      cx: CanvasSize / 2,
      cy: CanvasSize / 2,
      debug: false,
      diameter: CanvasSize * 0.3,
      fill: palette3("transparent"),
      stroke: getRandomColor(),
      petals: Array(randomNumberInRange2(20, 50)).fill({
        height: randomNumberInRange2(0, 100),
        frequency: 20,
        slope: randomNumberInRange2(1, 3)
      }),
      rotation: randomNumberInRange2(0, 90),
      rotationSpeed: -0.5,
      strokeWidth: "1"
    });
    const [RingThree, RingThreeMessage] = useMandala({
      cx: CanvasSize / 2,
      cy: CanvasSize / 2,
      debug: false,
      diameter: CanvasSize * 0.3,
      fill: palette3("transparent"),
      stroke: getRandomColor(),
      petals: [
        ...Array(randomNumberInRange2(20, 50)).fill({
          height: randomNumberInRange2(0, 100),
          frequency: 20,
          slope: randomNumberInRange2(1, 6)
        })
      ],
      rotation: randomNumberInRange2(0, 90),
      rotationSpeed: 1,
      strokeWidth: "1"
    });
    return Mandala2(RingOne, RingTwo, RingThree);
  };
  var useSplashScreen = () => {
    let interval;
    const [wrapper] = useHtml("div", ["class", css3("wrapper")]);
    const [container] = useHtml("div", ["class", css3("container")]);
    const stopAnimation = () => clearInterval(interval);
    const startAnimation = () => {
      stopAnimation();
      interval = setInterval(() => setAnimationContainer(createMandala()));
    };
    const [animationContainer, setAnimationContainer] = useHtml("div", ["class", css3("animationContainer")]);
    const [title] = useHtml("div", ["class", css3("title")]);
    const [github] = useHtml("a", ["class", css3("github_link", "white_text_on_hover")], ["href", "http://github.com/kvnlnt/feds"], ["target", "_blank"]);
    const [subTitle] = useHtml("div", ["class", css3("subTitle")]);
    const [tagline] = useHtml("div", ["class", css3("tagline", "fs_12", "fs_15_on_tablet")]);
    const [button] = useHtml("button", ["class", css3("button", "bg_white_on_hover")], ["onclick", () => alert("COMING SOON!!! ")], ["onmouseover", () => startAnimation()], ["onmouseout", () => stopAnimation()]);
    const [dashboard] = useIsoShell(wrapper(github("github"), container(title("feds"), subTitle("Own Your Framework"), animationContainer(createMandala()), tagline("A hard to break, easy to fix frontend development system designed for adoption. Own your framework or it will own you."), button("Prove It"))));
    startAnimation();
    setTimeout(() => stopAnimation(), 2e3);
    return [dashboard];
  };

  // src/main.ts
  window.addEventListener("DOMContentLoaded", async () => {
    const [setBody] = useDom("body");
    const [splash] = useSplashScreen();
    setBody(splash);
  });
})();
//# sourceMappingURL=feds.js.map
