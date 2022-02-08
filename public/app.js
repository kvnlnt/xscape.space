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
  function html(tag, ...attrs) {
    return (...children) => HTML({tag, attrs, children});
  }
  function useHtml(tag, ...attrs) {
    let container;
    let hasRendered = false;
    const replace = (...children) => {
      const attrs2 = [];
      Array.from(container.attributes).forEach((attr) => attrs2.push([attr.name, attr.value]));
      const newContainer = HTML({tag, attrs: attrs2, children});
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
        if (container)
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

  // src/app/lib/Property.ts
  var useProperty = (prop, callback) => {
    let property = prop;
    const getter = () => {
      return property;
    };
    const setter = (newProp) => {
      property = newProp;
      if (callback)
        callback(property);
    };
    return [getter, setter];
  };

  // src/app/components/Meter.ts
  var [palette2] = usePalette();
  var [css2] = useCss({
    meter: [
      ["display", "flex"],
      ["flexDirection", "row"],
      ["height", "50px"],
      ["alignItems", "flex-end"],
      ["justifyContent", "center"]
    ],
    bar: [
      ["backgroundColor", palette2("purple")],
      ["marginLeft", "1px"],
      ["borderRadius", "2px"],
      ["minHeight", "5px"]
    ],
    width_150: [["width", "150px"]],
    width_400: [["width", "400px"]]
  });
  var Meter = (readings) => {
    const [meter] = useHtml("div", ["class", css2("meter", "width_150", "width_400_on_tablet")]);
    const bars = readings.map((reading) => {
      const [bar] = useHtml("div", ["class", css2("bar")], ["style", `height:${reading}%;width:5px;`]);
      return bar();
    });
    return meter(...bars);
  };

  // src/app/lib/Audio.ts
  var useAudio = (mp3Url, rmsCallback) => {
    const [state, setState] = useProperty("INIT");
    let audioCtx;
    let audio;
    const init = () => {
      audioCtx = new AudioContext();
      audio = new Audio(mp3Url);
      audio.crossOrigin = "anonymous";
      const processor = audioCtx.createScriptProcessor(2048, 1, 1);
      audio.addEventListener("canplaythrough", function() {
        const source = audioCtx.createMediaElementSource(audio);
        source.connect(processor);
        source.connect(audioCtx.destination);
        processor.connect(audioCtx.destination);
      }, false);
      processor.addEventListener("audioprocess", function(evt) {
        const input = evt.inputBuffer.getChannelData(0);
        const len = input.length;
        let total = 0;
        let i = 0;
        let rms;
        while (i < len)
          total += Math.abs(input[i++]);
        rms = Math.sqrt(total / len);
        if (state() === "PLAYING")
          rmsCallback(rms * 100);
      });
    };
    const play = () => {
      if (state() === "INIT")
        init();
      setState("PLAYING");
      audio.play();
    };
    const pause = () => {
      setState("PAUSED");
      audio.pause();
    };
    return {play, pause, state};
  };

  // src/app/components/Player.ts
  var [palette3] = usePalette();
  var [css3] = useCss({
    player: [
      ["fontFamily", "monospace"],
      ["fontSize", "16px"],
      ["display", "flex"],
      ["cursor", "pointer"],
      ["flexDirection", "column"],
      ["justifyContent", "center"],
      ["alignItems", "center"]
    ],
    btn: [
      ["color", palette3("white", 0, 0.2)],
      ["display", "flex"],
      ["fontSize", "12px"],
      ["marginTop", "20px"]
    ],
    btnText: [["letterSpacing", "4px"]],
    spacer: [
      ["padding", "0 10px"],
      ["display", "inline-block"],
      ["color", palette3("white", 0, 0.1)]
    ]
  });
  var Player = (mp3Url) => {
    const [meter] = useHtml("div");
    const numOfBars = 20;
    const emptyMeter = Meter(Array(numOfBars).fill(1));
    const readings = Array(numOfBars).fill(0);
    const {play, pause, state} = useAudio(mp3Url, (rms) => {
      if (readings.length >= numOfBars) {
        readings.shift();
        readings.push(rms);
      } else {
        readings.push(rms);
      }
      meter(Meter(readings));
    });
    const [btn] = useHtml("div", ["class", css3("btn")]);
    const [btnText] = useHtml("div", ["class", css3("btnText")]);
    const [spacer] = useHtml("div", ["class", css3("spacer")]);
    const togglePlay = () => {
      if (state() === "PLAYING") {
        pause();
        btn(btnText("SPACE"), spacer("|"), btnText("PAUSED"));
        meter(emptyMeter);
      } else {
        play();
        btn(btnText("SPACE"), spacer("|"), btnText("PLAYING"));
      }
    };
    const [player] = useHtml("div", ["class", css3("player")], ["onclick", togglePlay]);
    return player(meter(emptyMeter), btn(btnText("SPACE"), spacer("|"), btnText("PLAY")));
  };

  // src/app/lib/Fonts.ts
  var Font;
  (function(Font2) {
    Font2["arial"] = "Arial";
    Font2["monospace"] = "Monospace";
  })(Font || (Font = {}));
  var useFont = () => {
    const getter = (font2) => Font[font2];
    return [getter];
  };

  // src/app/lib/KeyPress.ts
  var useKeyPress = () => {
    const subscriptions = {};
    document.addEventListener("keyup", (e) => {
      (subscriptions[e.code] || []).forEach((subscription) => subscription());
    });
    const sub = (key, callback) => {
      if (!subscriptions.hasOwnProperty(key))
        subscriptions[key] = [];
      subscriptions[key].push(callback);
    };
    return [sub];
  };

  // src/app/components/Playlist.ts
  var [palette4] = usePalette();
  var [font] = useFont();
  var [css4] = useCss({
    playlist: [["display", "none"]],
    playlist_active: [
      ["display", "flex"],
      ["flexDirection", "column"]
    ],
    item: [
      ["color", palette4("white")],
      ["padding", "5px"],
      ["fontFamily", font("monospace")],
      ["cursor", "pointer"],
      ["display", "flex"],
      ["alignItems", "center"],
      ["backgroundSize", "cover"],
      ["backgroundRepeat", "no-repeat"],
      ["backgroundPositionX", "-100vw"],
      ["backgroundImage", `linear-gradient(to right, ${palette4("white")} 100%, ${palette4("transparent")} 0%)`],
      ["transition", "all 0.25s"]
    ],
    item_active: [
      ["backgroundImage", `linear-gradient(to right, ${palette4("white")} 100%, ${palette4("transparent")} 0%)`],
      ["backgroundPositionX", "0vw"],
      ["transition", "all 0.25s"],
      ["color", palette4("black")]
    ],
    item_song: [
      ["fontFamily", font("monospace")],
      ["padding", "5px"],
      ["transition", "all 0.5s"]
    ],
    item_artist: [
      ["color", palette4("black", 50, 1)],
      ["fontFamily", font("monospace")],
      ["fontSize", "10px"],
      ["marginLeft", "5px"],
      ["transition", "all 0.5s"]
    ]
  });
  var usePlaylist = ({space}) => {
    const [keypress] = useKeyPress();
    const [playState, setPlayState] = useProperty("INIT");
    const [songIndex, setSongIndex] = useProperty(0);
    const [playlist, playlistAttrs] = useHtml("div", ["class", css4("playlist")]);
    const render = () => {
      return playlist(...space.songs.map((song, i) => {
        return html("div", ["class", css4("item", i === songIndex() ? "item_active" : "item_active_on_hover")], ["onclick", () => machine({action: "PLAY", index: i})])(html("div", ["class", css4("item_song")])(song.songName), html("a", ["class", css4("item_artist")], ["href", song.artistLink], ["target", "_blank"])("@" + song.artist));
      }));
    };
    const actions = {
      init() {
        playlistAttrs(["class", css4("playlist_active")]);
      },
      play(index) {
        setSongIndex(index);
        render();
      },
      playNext() {
        setSongIndex(songIndex() === space.songs.length - 1 ? 0 : songIndex() + 1);
        render();
      },
      playPrev() {
        setSongIndex(songIndex() === 0 ? space.songs.length - 1 : songIndex() - 1);
        render();
      },
      quit() {
        playlistAttrs(["class", css4("playlist")]);
      }
    };
    keypress("ArrowUp", () => machine({action: "PLAY_PREV"}));
    keypress("ArrowDown", () => machine({action: "PLAY_NEXT"}));
    const machine = (reducer) => {
      switch (playState()) {
        case "INIT":
          actions.init();
          setPlayState("PLAYING");
          break;
        case "PLAYING":
          switch (reducer.action) {
            case "PLAY":
              actions.play(reducer.index);
              break;
            case "PLAY_NEXT":
              actions.playNext();
              break;
            case "PLAY_PREV":
              actions.playPrev();
              break;
            case "QUIT":
              actions.quit();
              setPlayState("INIT");
              break;
          }
          break;
      }
    };
    const component = [render(), machine];
    return component;
  };

  // src/app/components/Space.ts
  var [palette5] = usePalette();
  useFontFace("anurati", `url('assets/Anurati-Regular.otf')`);
  var [kf] = useKeyFrames({
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
    ],
    fade_in: [
      [0, "opacity", 0],
      [100, "opacity", 1]
    ],
    fade_out: [
      [0, "opacity", 1],
      [100, "opacity", 0]
    ]
  });
  var [css5] = useCss({
    container: [
      ["backgroundColor", palette5("white", 0, 0.05)],
      ["color", palette5("white")],
      ["display", "flex"],
      ["justifyContent", "center"],
      ["alignItems", "center"],
      ["width", "90vw"],
      ["height", "90vh"],
      ["border", `1px solid ${palette5("white", 0, 0.1)}`],
      ["flexDirection", "column"],
      ["position", "relative"]
    ],
    container_active: [
      ["animation", kf("container_zoom_width_in", "container_zoom_height_in")],
      ["animationFillMode", "forwards"],
      ["animationDuration", "0.5s"],
      ["justifyContent", "flex-start"]
    ],
    container_deactive: [
      ["animation", kf("container_zoom_width_out", "container_zoom_height_out")],
      ["animationFillMode", "forwards"],
      ["animationDuration", "0.5s"]
    ],
    current_title: [
      ["position", "fixed"],
      ["bottom", "10vh"],
      ["left", "10vw"]
    ],
    play_button: [
      ["fontFamily", "anurati"],
      ["fontSize", "5vh"],
      ["marginTop", "40px"],
      ["opacity", "0"],
      ["padding", "20px 20px 20px 24px  "],
      ["backgroundColor", palette5("transparent")],
      ["color", palette5("white", 0, 0.5)],
      ["border", `0`],
      ["cursor", "pointer"],
      ["transition", "all 0.5s"]
    ],
    play_button_active: [
      ["fontFamily", "anurati"],
      ["fontSize", "3vh"],
      ["marginTop", "0px"],
      ["opacity", "100"],
      ["padding", "20px 20px 20px 24px  "],
      ["backgroundColor", palette5("transparent")],
      ["color", palette5("white", 0, 0.5)],
      ["border", `0`],
      ["cursor", "pointer"],
      ["transition", "all 0.5s"]
    ],
    play_button_transition_in: [
      ["animation", kf("fade_in")],
      ["animationFillMode", "forwards"],
      ["animationDuration", "0.5s"]
    ],
    play_button_transition_out: [
      ["animation", kf("fade_out")],
      ["animationFillMode", "forwards"],
      ["animationDuration", "0.5s"]
    ],
    playlist_container: [
      ["opacity", "0"],
      ["transition", "all 0.5s"],
      ["position", "absolute"],
      ["left", "5vh"],
      ["bottom", "50vh"],
      ["width", "100vw"],
      ["height", "20vh"]
    ],
    playlist_container_active: [
      ["opacity", "100"],
      ["transition", "all 0.5s"],
      ["position", "absolute"],
      ["left", "0vh"],
      ["top", "0vh"],
      ["width", "90vw"],
      ["height", "calc(90vh - 10vw)"],
      ["boxSizing", "border-box"],
      ["margin", "5vw"]
    ],
    font_big: [["fontSize", "66px"]],
    sub_title: [
      ["fontFamily", "anurati"],
      ["fontSize", "10px"],
      ["letterSpacing", "40px"],
      ["paddingLeft", "40px"],
      ["marginTop", "40px"],
      ["opacity", "0"],
      ["transition", "all 0.5s"]
    ],
    sub_title_active: [
      ["fontFamily", "anurati"],
      ["fontSize", "10px"],
      ["letterSpacing", "4px"],
      ["paddingLeft", "40px"],
      ["marginTop", "0px"],
      ["opacity", "0"],
      ["transition", "all 0.5s"]
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
    title_active: [
      ["fontFamily", "anurati"],
      ["fontSize", "24px"],
      ["letterSpacing", "40px"],
      ["paddingLeft", "40px"],
      ["opacity", "0"],
      ["transition", "all 0.5s"]
    ],
    title_active_play_mode: [
      ["fontFamily", "anurati"],
      ["fontSize", "24px"],
      ["letterSpacing", "10px"],
      ["paddingLeft", "24px"],
      ["opacity", "100"],
      ["transition", "all 0.5s"]
    ],
    title_inactive: [
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
    title_container: [
      ["position", "absolute"],
      ["width", "60vw"],
      ["height", "60vh"],
      ["left", "15vw"],
      ["bottom", "15vh"],
      ["display", "flex"],
      ["justifyContent", "center"],
      ["alignItems", "center"],
      ["flexDirection", "column"],
      ["transition", "all 0.5s"],
      ["borderTop", `1px solid ${palette5("white", 0, 0)}`]
    ],
    title_container_play_mode: [
      ["position", "absolute"],
      ["width", "90vw"],
      ["height", "10vh"],
      ["left", "5vw"],
      ["bottom", "0vh"],
      ["display", "flex"],
      ["justifyContent", "space-between"],
      ["alignItems", "center"],
      ["borderTop", `1px solid ${palette5("white", 0, 0.1)}`],
      ["flexDirection", "row"],
      ["transition", "all 0.5s"],
      ["paddingTop", "0px"]
    ],
    width_30: [["width", "30vw"]]
  });
  var useSpace = (space) => {
    const {name: title} = space;
    const [state, setState] = useProperty("PASSIVE");
    const [container, containerAttrs] = useHtml("div", ["class", css5("container")]);
    const [title_container, titleContainerAttrs] = useHtml("div", ["class", css5("title_container")]);
    const [header, headerAttrs] = useHtml("div", ["class", css5("title_active", "font_big_on_tablet")]);
    const [playlist_container, playlistContainerAttrs] = useHtml("div", [
      "class",
      css5("playlist_container", "width_30_on_tablet")
    ]);
    const [playlist, playlistMachine] = usePlaylist({space});
    const [subHeader, subHeaderAttrs] = useHtml("div", ["class", css5("sub_title")]);
    const [playButton, playButtonAttrs] = useHtml("button", ["class", css5("play_button")], ["onclick", () => machine("ACTIVATE")]);
    const action = {
      activate: () => {
        containerAttrs(["class", css5("container", "container_active")]);
        titleContainerAttrs(["class", css5("title_container_play_mode")]);
        headerAttrs(["class", css5("title_active_play_mode")]);
        subHeaderAttrs(["class", css5("sub_title_active", "sub_title_transition_out")]);
        playButtonAttrs(["class", css5("play_button_active")]);
        playButton("\u25A2");
        playlistContainerAttrs(["class", css5("playlist_container_active", "width_30_on_tablet")]);
        playlistMachine({action: "START"});
      },
      deactivate: () => {
        containerAttrs(["class", css5("container", "container_deactive")]);
        titleContainerAttrs(["class", css5("title_container")]);
        headerAttrs(["class", css5("title_active", "title_transition_in", "font_big_on_tablet")]);
        subHeaderAttrs(["class", css5("sub_title", "sub_title_transition_in")]);
        playButtonAttrs(["class", css5("play_button", "play_button_transition_in")]);
        playButton("\u25B7");
        playlistContainerAttrs(["class", css5("playlist_container")]);
        playlistMachine({action: "QUIT"});
      },
      slideIn: () => {
        headerAttrs(["class", css5("title_active", "title_transition_in", "font_big_on_tablet")]);
        subHeaderAttrs(["class", css5("sub_title", "sub_title_transition_in")]);
        playButtonAttrs(["class", css5("play_button", "play_button_transition_in")]);
      },
      slideOut: () => {
        headerAttrs(["class", css5("title_active", "font_big_on_tablet", "title_transition_out")]);
        subHeaderAttrs(["class", css5("sub_title", "sub_title_transition_out")]);
        playButtonAttrs(["class", css5("play_button", "play_button_transition_out")]);
      }
    };
    const machine = (event) => {
      switch (state()) {
        case "PASSIVE":
          switch (event) {
            case "SLIDE_IN":
              action.slideIn();
              setState("PASSIVE");
              break;
            case "SLIDE_OUT":
              action.slideOut();
              setState("PASSIVE");
              break;
            case "ACTIVATE":
              action.activate();
              setState("ACTIVE");
              break;
          }
          break;
        case "ACTIVE":
          switch (event) {
            case "DEACTIVATE":
              action.deactivate();
              setState("PASSIVE");
              break;
          }
          break;
      }
    };
    return [
      container(playlist_container(playlist), title_container(header(title.toUpperCase()), subHeader("SPACE"), Player(space.songs[0].mp3Url), playButton("\u25B7"))),
      machine
    ];
  };

  // src/domain/data/ChillSpace.ts
  var ChillSpace_default = {
    name: "chill",
    songs: [
      {
        artist: "rapT0R",
        artistLink: "https://soundcloud.com/linttraprecords/sets/black-wolf-beats",
        songName: "Don't be sad bro",
        mp3Url: "https://s3.us-west-2.amazonaws.com/files.kevinlint.com/audio/lincoln/sad.mp3"
      },
      {
        artist: "rapT0R",
        artistLink: "https://soundcloud.com/linttraprecords/sets/black-wolf-beats",
        songName: "Don't be sad bro 2",
        mp3Url: "https://s3.us-west-2.amazonaws.com/files.kevinlint.com/audio/lincoln/sad.mp3"
      }
    ]
  };

  // src/domain/data/DeepSpace.ts
  var DeepSpace_default = {
    name: "deep",
    songs: [
      {
        artist: "rapT0R",
        artistLink: "https://soundcloud.com/linttraprecords/sets/black-wolf-beats",
        songName: "Don't be sad bro",
        mp3Url: "https://s3.us-west-2.amazonaws.com/files.kevinlint.com/audio/lincoln/sad.mp3"
      },
      {
        artist: "rapT0R",
        artistLink: "https://soundcloud.com/linttraprecords/sets/black-wolf-beats",
        songName: "Don't be sad bro 2",
        mp3Url: "https://s3.us-west-2.amazonaws.com/files.kevinlint.com/audio/lincoln/sad.mp3"
      }
    ]
  };

  // src/domain/data/ThinkSpace.ts
  var ThinkSpace_default = {
    name: "think",
    songs: [
      {
        artist: "dfaasf as as",
        artistLink: "https://soundcloud.com/linttraprecords/sets/black-wolf-beats",
        songName: "asdf fasdf asdfsa",
        mp3Url: "https://s3.us-west-2.amazonaws.com/files.kevinlint.com/audio/lincoln/sad.mp3"
      },
      {
        artist: "rapT0R",
        artistLink: "https://soundcloud.com/linttraprecords/sets/black-wolf-beats",
        songName: "Don't be sad bro 2",
        mp3Url: "https://s3.us-west-2.amazonaws.com/files.kevinlint.com/audio/lincoln/sad.mp3"
      }
    ]
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
  var [palette6] = usePalette();
  var [css6] = useCss({
    body: [
      ["backgroundColor", palette6("black")],
      ["overflow", "hidden"]
    ],
    container: [
      ["width", "100vw"],
      ["height", "100vh"]
    ]
  });
  var useEscapePage = (parent) => {
    useDom("body", ["className", css6("body")]);
    const [swipe] = useSwipe();
    const [keypress] = useKeyPress();
    const [activeSlide, setActiveSlide] = useProperty("THINK");
    const [state, setState] = useProperty("INIT");
    const [container] = useHtml("div", ["class", css6("container")]);
    const [thinkSpace, thinkMachine] = useSpace(ThinkSpace_default);
    const [chillSpace, chillMachine] = useSpace(ChillSpace_default);
    const [deepSpace, deepMachine] = useSpace(DeepSpace_default);
    const [slides, slider] = useSlider([
      {name: "DEEP", element: deepSpace},
      {name: "THINK", element: thinkSpace},
      {name: "CHILL", element: chillSpace}
    ], ({slidingIn, slidingOut}) => {
      setActiveSlide(slidingIn);
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
    });
    swipe("RIGHT", () => machine("NEXT_SLIDE"));
    swipe("LEFT", () => machine("PREV_SLIDE"));
    keypress("ArrowRight", () => machine("NEXT_SLIDE"));
    keypress("ArrowLeft", () => machine("PREV_SLIDE"));
    keypress("Escape", () => machine("ESCAPE_OUT_OF_SPACE"));
    keypress("Space", () => machine("ESCAPE_INTO_SPACE"));
    const actions = {
      render() {
        parent(container(slides));
        slider("INIT");
        return "SEARCHING";
      },
      enterSpace() {
        switch (activeSlide()) {
          case "THINK":
            thinkMachine("ACTIVATE");
            return "THINKING";
          case "CHILL":
            chillMachine("ACTIVATE");
            return "CHILLING";
          case "DEEP":
            deepMachine("ACTIVATE");
            return "IN_DEEP";
        }
      },
      escapeSpace() {
        switch (activeSlide()) {
          case "THINK":
            thinkMachine("DEACTIVATE");
            return "SEARCHING";
          case "CHILL":
            chillMachine("DEACTIVATE");
            return "SEARCHING";
          case "DEEP":
            deepMachine("DEACTIVATE");
            return "SEARCHING";
        }
      }
    };
    const machine = (event = null) => {
      switch (state()) {
        case "INIT":
          setState(actions.render());
          break;
        case "SEARCHING":
          switch (event) {
            case "NEXT_SLIDE":
              slider("NEXT");
              break;
            case "PREV_SLIDE":
              slider("PREV");
              break;
            case "ESCAPE_INTO_SPACE":
              setState(actions.enterSpace());
              break;
          }
          break;
        case "THINKING":
        case "CHILLING":
        case "IN_DEEP":
          switch (event) {
            case "ESCAPE_OUT_OF_SPACE":
              setState(actions.escapeSpace());
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
