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

  // src/app/components/Slider.css.ts
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

  // src/app/components/Slider.ts
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
    return sub;
  };

  // src/app/lib/Font.ts
  var Font;
  (function(Font2) {
    Font2["arial"] = "Arial";
    Font2["monospace"] = "Monospace";
  })(Font || (Font = {}));
  var useFont = () => {
    const getter = (font3) => Font[font3];
    return getter;
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

  // src/app/components/Playlist.styles.ts
  var [palette] = usePalette();
  var font = useFont();
  var [css2] = useCss({
    playlist: [["display", "none"]],
    playlist_active: [
      ["display", "flex"],
      ["flexDirection", "column"]
    ],
    item: [
      ["color", palette("white")],
      ["padding", "5px"],
      ["fontFamily", font("monospace")],
      ["cursor", "pointer"],
      ["display", "flex"],
      ["alignItems", "center"],
      ["backgroundSize", "cover"],
      ["backgroundRepeat", "no-repeat"],
      ["backgroundPositionX", "-100vw"],
      ["backgroundImage", `linear-gradient(to right, ${palette("white")} 100%, ${palette("transparent")} 0%)`],
      ["transition", "all 0.25s"]
    ],
    item_active: [
      ["backgroundImage", `linear-gradient(to right, ${palette("white")} 100%, ${palette("transparent")} 0%)`],
      ["backgroundPositionX", "0vw"],
      ["transition", "all 0.25s"],
      ["color", palette("black")]
    ],
    item_song: [
      ["fontFamily", font("monospace")],
      ["padding", "5px"],
      ["transition", "all 0.5s"]
    ],
    item_artist: [
      ["color", palette("black", 50, 1)],
      ["fontFamily", font("monospace")],
      ["fontSize", "10px"],
      ["marginLeft", "5px"],
      ["transition", "all 0.5s"]
    ]
  });

  // src/app/components/Playlist.ts
  var usePlaylist = ({space, callback}) => {
    const keypress = useKeyPress();
    let playState = "INIT";
    let songIndex = 0;
    const [playlist, playlistAttrs] = useHtml("div", ["class", css2("playlist")]);
    const render = () => {
      return playlist(...space.songs.map((song, i) => {
        return html("div", ["class", css2("item", i === songIndex ? "item_active" : "item_active_on_hover")], ["onclick", () => machine({action: "PLAY", index: i})])(html("div", ["class", css2("item_song")])(song.songName), html("a", ["class", css2("item_artist")], ["href", song.artistLink], ["target", "_blank"])("@" + song.artist));
      }));
    };
    const init = () => {
      playlistAttrs(["class", css2("playlist_active")]);
      callback(songIndex);
    };
    const play = (index) => {
      songIndex = index;
      callback(index);
      render();
    };
    const playNext = () => {
      const newIndex = songIndex === space.songs.length - 1 ? 0 : songIndex + 1;
      songIndex = newIndex;
      callback(newIndex);
      render();
    };
    const playPrev = () => {
      const newIndex = songIndex === 0 ? space.songs.length - 1 : songIndex - 1;
      songIndex = newIndex;
      callback(newIndex);
      render();
    };
    const quit = () => {
      playlistAttrs(["class", css2("playlist")]);
    };
    keypress("ArrowUp", () => machine({action: "PLAY_PREV"}));
    keypress("ArrowDown", () => machine({action: "PLAY_NEXT"}));
    const machine = (message) => {
      switch (playState) {
        case "INIT":
          switch (message.action) {
            case "START":
              init();
              playState = "PLAYING";
              break;
            default:
              init();
              playState = "PLAYING";
              break;
          }
        case "PLAYING":
          switch (message.action) {
            case "PLAY":
              play(message.index);
              break;
            case "PLAY_NEXT":
              playNext();
              break;
            case "PLAY_PREV":
              playPrev();
              break;
            case "QUIT":
              quit();
              playState = "INIT";
              break;
          }
          break;
      }
    };
    const component = [render(), machine];
    return component;
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

  // src/app/components/Space.styles.ts
  var [palette2] = usePalette();
  var font2 = useFont();
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
  var [css3] = useCss({
    container: [
      ["backgroundColor", palette2("white", 0, 0.05)],
      ["color", palette2("white")],
      ["display", "flex"],
      ["justifyContent", "center"],
      ["alignItems", "center"],
      ["width", "90vw"],
      ["height", "90vh"],
      ["border", `1px solid ${palette2("white", 0, 0.1)}`],
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
      ["fontFamily", font2("arial")],
      ["fontSize", "5vh"],
      ["marginTop", "40px"],
      ["opacity", "0"],
      ["padding", "20px 20px 20px 24px  "],
      ["backgroundColor", palette2("transparent")],
      ["color", palette2("white", 0, 0.5)],
      ["border", `0`],
      ["cursor", "pointer"],
      ["transition", "all 0.5s"]
    ],
    play_button_active: [
      ["fontFamily", font2("arial")],
      ["fontSize", "3vh"],
      ["marginTop", "0px"],
      ["opacity", "100"],
      ["padding", "20px 20px 20px 24px  "],
      ["backgroundColor", palette2("transparent")],
      ["color", palette2("white", 0, 0.5)],
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
    spectralizer_container: [
      ["height", "100px"],
      ["animation", kf("fade_in")],
      ["animationFillMode", "forwards"],
      ["animationDuration", "0.5s"],
      ["animationDelay", "0.5s"],
      ["animationTimingFunction", "ease-in"],
      ["opacity", 0]
    ],
    title_active: [
      ["fontFamily", font2("arial")],
      ["fontSize", "24px"],
      ["letterSpacing", "40px"],
      ["paddingLeft", "40px"],
      ["opacity", "0"],
      ["transition", "all 0.5s"],
      ["marginBottom", "50px"]
    ],
    title_active_play_mode: [
      ["fontFamily", font2("arial")],
      ["fontSize", "0px"],
      ["letterSpacing", "10px"],
      ["paddingLeft", "0px"],
      ["opacity", "0.1"],
      ["transition", "all 0.5s"],
      ["marginBottom", "0px"]
    ],
    title_inactive: [
      ["fontFamily", font2("arial")],
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
      ["transition", "all 0.5s"]
    ],
    title_container_play_mode: [
      ["position", "absolute"],
      ["width", "90vw"],
      ["height", "125px"],
      ["left", "5vw"],
      ["bottom", "5vh"],
      ["display", "flex"],
      ["justifyContent", "space-between"],
      ["alignItems", "center"],
      ["flexDirection", "column"],
      ["transition", "all 0.5s"],
      ["paddingTop", "0px"]
    ],
    width_30: [["width", "30vw"]]
  });

  // src/app/components/Spectralizer.styles.ts
  var [palette3] = usePalette();
  var [css4] = useCss({
    spectralizer: [
      ["display", "flex"],
      ["flexDirection", "row"],
      ["alignItems", "center"],
      ["justifyContent", "center"],
      ["height", "100%"],
      ["cursor", "pointer"]
    ],
    bar_bg: [
      ["backgroundColor", palette3("white", 0, 0.02)],
      ["marginLeft", "5px"],
      ["borderRadius", "7px"],
      ["display", "flex"],
      ["flexDirection", "row"],
      ["alignItems", "center"],
      ["justifyContent", "center"],
      ["height", "100%"],
      ["width", "5px"]
    ],
    bar: [
      ["backgroundColor", palette3("purple")],
      ["borderRadius", "7px"],
      ["width", "100%"],
      ["transition", "all 0.10s"],
      ["height", "0%"]
    ]
  });

  // src/app/components/Spectralizer.ts
  var useSpectralizer = ({
    state = "IDLE"
  }) => {
    const [spectralizer] = useHtml("div", ["class", css4("spectralizer")], ["onmouseenter", () => machine({action: "HOVER_OVER"})], ["onmouseleave", () => machine({action: "HOVER_OUT"})]);
    let viewState = state;
    let wave = [0, 10, 20, 30, 40, 70, 90, 90, 70, 40, 30, 20, 10, 0];
    let waveInterval;
    let streamWave = [0, 10, 20, 30, 40, 70, 90, 90, 70, 40, 30, 20, 10, 0];
    const playButton = [0, 0, 0, 0, 50, 40, 30, 20, 10, 4, 0, 0, 0, 0];
    const pauseButton = [0, 0, 0, 50, 50, 50, 0, 0, 50, 50, 50, 0, 0, 0];
    const off = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
    const barBgs = off.map(() => useHtml("div", ["class", css4("bar_bg")]));
    const bars = off.map((i) => useHtml("div", ["class", css4("bar")], ["style", `height:${i}%;`]));
    const render = () => spectralizer(...barBgs.map(([barBg], bar) => barBg(bars[bar][0]())));
    const shuffle = (ary) => ary.slice(0).sort(() => Math.random() - 0.5);
    const animateIn = () => {
      playButton.forEach((i, ii) => bars[ii][1](["style", `height:${i}%;`]));
    };
    const animateOut = () => {
      off.forEach((i, ii) => bars[ii][1](["style", `height:${i}%;`]));
    };
    const animateWave = () => {
      wave = shuffle(wave);
      wave.forEach((i, ii) => bars[ii][1](["style", `height:${i}%;`]));
    };
    const stream = (rms) => {
      streamWave.shift();
      streamWave.push(rms);
      streamWave.forEach((i, ii) => bars[ii][1](["style", `height:${i}%;`]));
    };
    const reset = () => {
      playButton.forEach((i, ii) => bars[ii][1](["style", `height:${i}%;`]));
    };
    const showPauseButton = () => {
      pauseButton.forEach((i, ii) => bars[ii][1](["style", `height:${i}%;`]));
    };
    const showPlayButton = () => {
      playButton.forEach((i, ii) => bars[ii][1](["style", `height:${i}%;`]));
    };
    const machine = (message) => {
      console.log(message);
      switch (viewState) {
        case "IDLE":
          switch (message.action) {
            case "ANIMATE_IN":
              animateIn();
              break;
            case "ANIMATE_OUT":
              animateOut();
              break;
            case "PLAY":
              viewState = "STREAMING";
              clearInterval(waveInterval);
              break;
            case "HOVER_OVER":
              waveInterval = setInterval(animateWave, 20);
              break;
            case "HOVER_OUT":
              clearInterval(waveInterval);
              animateIn();
              break;
          }
          break;
        case "STREAMING":
          switch (message.action) {
            case "STREAM":
              stream(message.rms);
              break;
            case "RESET":
              viewState = "IDLE";
              reset();
              break;
            case "HOVER_OVER":
              viewState = "STREAMING_HOVER";
              showPauseButton();
              break;
          }
          break;
        case "STREAMING_HOVER":
          switch (message.action) {
            case "HOVER_OUT":
              viewState = "STREAMING";
              showPlayButton();
              break;
          }
      }
    };
    return [render(), machine];
  };

  // src/app/components/Space.ts
  var useSpace = (props) => {
    const {space, onEscape, audioMachine} = props;
    const {name} = space;
    let state = "PASSIVE";
    let songIndex = 0;
    const [container, containerAttrs] = useHtml("div", ["class", css3("container")]);
    const [title_container, titleContainerAttrs] = useHtml("div", ["class", css3("title_container")]);
    const [header, headerAttrs] = useHtml("div", ["class", css3("title_active", "font_big_on_tablet")]);
    const [playlist_container, playlistContainerAttrs] = useHtml("div", ["class", css3("playlist_container")]);
    const spectralizer_container = html("div", ["class", css3("spectralizer_container")]);
    const [spectralizer, spectralizerMachine] = useSpectralizer({});
    const [playlist, playlistMachine] = usePlaylist({
      space,
      callback: (i) => machine({action: "SONG_CHANGE", songIndex: i})
    });
    const activate = () => {
      containerAttrs(["class", css3("container", "container_active")]);
      titleContainerAttrs(["class", css3("title_container_play_mode")]);
      headerAttrs(["class", css3("title_active_play_mode")]);
      playlistContainerAttrs(["class", css3("playlist_container_active")]);
      playlistMachine({action: "START"});
      spectralizerMachine({action: "PLAY"});
    };
    const deactivate = () => {
      containerAttrs(["class", css3("container", "container_deactive")]);
      titleContainerAttrs(["class", css3("title_container")]);
      headerAttrs(["class", css3("title_active", "title_transition_in", "font_big_on_tablet")]);
      playlistContainerAttrs(["class", css3("playlist_container")]);
      playlistMachine({action: "QUIT"});
      spectralizerMachine({action: "RESET"});
      audioMachine({action: "STOP"});
      onEscape();
    };
    const slideIn = () => {
      headerAttrs(["class", css3("title_active", "title_transition_in", "font_big_on_tablet")]);
      spectralizerMachine({action: "ANIMATE_IN"});
    };
    const slideOut = () => {
      headerAttrs(["class", css3("title_active", "font_big_on_tablet", "title_transition_out")]);
      spectralizerMachine({action: "ANIMATE_OUT"});
    };
    const render = () => container(playlist_container(playlist), title_container(header(name.toUpperCase()), spectralizer_container(spectralizer)));
    const playSong = () => {
      audioMachine({action: "PLAY", mp3Url: space.songs[songIndex].mp3Url});
    };
    const machine = (message) => {
      switch (state) {
        case "PASSIVE":
          switch (message.action) {
            case "SLIDE_IN":
              slideIn();
              state = "PASSIVE";
              break;
            case "SLIDE_OUT":
              slideOut();
              state = "PASSIVE";
              break;
            case "ACTIVATE":
              activate();
              playSong();
              state = "ACTIVE";
              break;
          }
          break;
        case "ACTIVE":
          switch (message.action) {
            case "DEACTIVATE":
              deactivate();
              state = "PASSIVE";
              break;
            case "SONG_CHANGE":
              songIndex = message.songIndex;
              playSong();
              break;
            case "RMS":
              spectralizerMachine({action: "STREAM", rms: message.rms});
              break;
          }
          break;
      }
    };
    return [render(), machine];
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

  // src/app/lib/Audio.ts
  var useAudio = (rmsCallback) => {
    let state = "IDLE";
    let audio;
    let audioCtx;
    const createAudioElement = (mp3, rmsCallback2) => {
      audioCtx = new AudioContext();
      audio = new Audio(mp3);
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
        rmsCallback2(rms * 100);
      });
      return audio;
    };
    const machine = (events) => {
      switch (state) {
        case "IDLE":
          switch (events.action) {
            case "PLAY":
              state = "PLAYING";
              audio = createAudioElement(events.mp3Url, rmsCallback);
              audio.play();
              break;
          }
          break;
        case "PLAYING":
          switch (events.action) {
            case "PAUSE":
              state = "PAUSED";
              audio.pause();
              break;
            case "PLAY":
              audio = createAudioElement(events.mp3Url, rmsCallback);
              audio.play();
            case "STOP":
              audioCtx.close();
              state = "IDLE";
          }
        case "PAUSED":
          switch (events.action) {
            case "PLAY":
              state = "PLAYING";
              audio.play();
              break;
          }
      }
    };
    return machine;
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

  // src/app/pages/Escape.styles.ts
  var [palette4] = usePalette();
  var [css5] = useCss({
    body: [
      ["backgroundColor", palette4("black")],
      ["overflow", "hidden"]
    ],
    container: [
      ["width", "100vw"],
      ["height", "100vh"]
    ]
  });

  // src/app/pages/Escape.ts
  var useEscapePage = (parent) => {
    useDom("body", ["className", css5("body")]);
    const [swipe] = useSwipe();
    const keypress = useKeyPress();
    let activeSlide = "THINK";
    let state = "INIT";
    const [container] = useHtml("div", ["class", css5("container")]);
    const audioMachine = useAudio((rms) => machine({action: "RMS", rms}));
    const [thinkSpace, thinkMachine] = useSpace({
      space: ThinkSpace_default,
      onEscape: () => machine({action: "ESCAPE_INTO_SPACE"}),
      audioMachine
    });
    const [chillSpace, chillMachine] = useSpace({
      space: ChillSpace_default,
      onEscape: () => machine({action: "ESCAPE_INTO_SPACE"}),
      audioMachine
    });
    const [deepSpace, deepMachine] = useSpace({
      space: DeepSpace_default,
      onEscape: () => machine({action: "ESCAPE_INTO_SPACE"}),
      audioMachine
    });
    const [slides, slider] = useSlider([
      {name: "DEEP", element: deepSpace},
      {name: "THINK", element: thinkSpace},
      {name: "CHILL", element: chillSpace}
    ], ({slidingIn, slidingOut}) => {
      activeSlide = slidingIn;
      if (slidingOut === "THINK")
        thinkMachine({action: "SLIDE_OUT"});
      if (slidingIn === "THINK")
        setTimeout(() => thinkMachine({action: "SLIDE_IN"}), 750);
      if (slidingOut === "CHILL")
        chillMachine({action: "SLIDE_OUT"});
      if (slidingIn === "CHILL")
        setTimeout(() => chillMachine({action: "SLIDE_IN"}), 750);
      if (slidingOut === "DEEP")
        deepMachine({action: "SLIDE_OUT"});
      if (slidingIn === "DEEP")
        setTimeout(() => deepMachine({action: "SLIDE_IN"}), 750);
    });
    swipe("RIGHT", () => machine({action: "NEXT_SLIDE"}));
    swipe("LEFT", () => machine({action: "PREV_SLIDE"}));
    keypress("ArrowRight", () => machine({action: "NEXT_SLIDE"}));
    keypress("ArrowLeft", () => machine({action: "PREV_SLIDE"}));
    keypress("Escape", () => machine({action: "ESCAPE_OUT_OF_SPACE"}));
    keypress("Space", () => machine({action: "ESCAPE_INTO_SPACE"}));
    const render = () => {
      parent(container(slides));
    };
    const enterSpace = () => {
      switch (activeSlide) {
        case "THINK":
          thinkMachine({action: "ACTIVATE"});
          break;
        case "CHILL":
          chillMachine({action: "ACTIVATE"});
          break;
        case "DEEP":
          deepMachine({action: "ACTIVATE"});
          break;
      }
    };
    const escapeSpace = () => {
      switch (activeSlide) {
        case "THINK":
          thinkMachine({action: "DEACTIVATE"});
          break;
        case "CHILL":
          chillMachine({action: "DEACTIVATE"});
          break;
        case "DEEP":
          deepMachine({action: "DEACTIVATE"});
          break;
      }
    };
    const machine = (message = null) => {
      console.log("escape", message, state);
      switch (state) {
        case "INIT":
          render();
          slider("INIT");
          state = "SLIDING";
          break;
        case "SLIDING":
          switch (message.action) {
            case "NEXT_SLIDE":
              slider("NEXT");
              break;
            case "PREV_SLIDE":
              slider("PREV");
              break;
            case "ESCAPE_INTO_SPACE":
              enterSpace();
              if (activeSlide === "THINK")
                state = "THINKING";
              if (activeSlide === "CHILL")
                state = "CHILLING";
              if (activeSlide === "DEEP")
                state = "IN_DEEP";
              break;
          }
          break;
        case "THINKING":
        case "CHILLING":
        case "IN_DEEP":
          switch (message.action) {
            case "ESCAPE_OUT_OF_SPACE":
              escapeSpace();
              state = "SLIDING";
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
