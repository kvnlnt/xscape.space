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

  // src/app/lib/Feds.ts
  function Attr(el, ...feature) {
    const [prop, val] = feature;
    el.setAttribute(prop, String(val));
  }
  function Color(el, ...feature) {
    const [color, brightness, opacity] = feature;
    const [h, s, l] = color;
    const hsla = `hsla(${h}deg,${s}%,${l + brightness}%,${opacity})`;
    el.style.color = hsla;
  }
  function Bind(el, ...feature) {
    const [cb] = feature;
    cb(el);
  }
  function OnSubmit(el, ...feature) {
    const [cb] = feature;
    el.addEventListener("submit", (evt) => {
      evt.preventDefault();
      cb(evt);
    });
  }
  function OnInput(el, ...feature) {
    const [cb] = feature;
    el.addEventListener("input", (evt) => cb(evt.target));
  }
  function Style(el, ...feature) {
    const [prop, val] = feature;
    el.style[prop] = val;
  }
  var html = (tag, ...features) => (...children) => {
    const el = document.createElementNS("http://www.w3.org/1999/xhtml", tag);
    features.forEach((feature) => {
      const [featureAttr, ...featureArgs] = feature;
      switch (featureAttr) {
        case "attr":
          Attr(el, ...featureArgs);
          break;
        case "bind":
          Bind(el, ...featureArgs);
          break;
        case "color":
          Color(el, ...featureArgs);
          break;
        case "style":
          Style(el, ...featureArgs);
          break;
        case "oninput":
          OnInput(el, ...featureArgs);
          break;
        case "onsubmit":
          OnSubmit(el, ...featureArgs);
          break;
      }
    });
    children.forEach((child) => {
      if (child instanceof Node)
        el.appendChild(child);
      if (typeof child === "string" || typeof child === "number")
        el.innerHTML += child;
    });
    return el;
  };
  var useEvent = (..._) => {
    const subscribers = [];
    const pub2 = (eventName) => subscribers.filter((i) => i.eventName === eventName).forEach((i) => i.cb());
    const sub2 = (eventName, cb) => subscribers.push({eventName, cb});
    return [pub2, sub2];
  };

  // src/app/pages/DesignSystem.ts
  var Events;
  (function(Events2) {
    Events2["TODO_CHANGE"] = "TODO_CHANGE";
  })(Events || (Events = {}));
  var state = "IDLE";
  var todo = "";
  var setTodo = (el) => machine({action: "TODO_UPDATE", todo: el.value});
  var handleSubmit = (evt) => console.log(evt.target, todo);
  var bindInputChange = (el) => sub(Events.TODO_CHANGE, () => {
    el.innerText = todo;
  });
  var [pub, sub] = useEvent();
  var machine = (message) => {
    switch (state) {
      case "IDLE":
        switch (message.action) {
          case "TODO_UPDATE":
            todo = message.todo;
            pub(Events.TODO_CHANGE);
            break;
        }
    }
  };
  var DesignSystem = () => html("div")(html("h1", ["color", "blue"])("ExampleApp"), html("h2", ["style", "fontSize", "24px"])("subtitle"), html("div", ["style", "fontSize", "18px"], ["bind", bindInputChange])("..."), html("form", ["onsubmit", handleSubmit])(html("fieldset")(html("legend")("to dos"), html("label")("todo"), html("input", ["attr", "name", "input"], ["oninput", setTodo])(), html("button", ["attr", "type", "submit"])("Submit"))));

  // src/main.ts
  window.addEventListener("DOMContentLoaded", async () => {
    const resetStyle = `margin:0px;padding:0px;width:100vw;height:100vh;`;
    const [body] = useDom("body", ["style", resetStyle]);
    body(DesignSystem());
  });
})();
//# sourceMappingURL=app.js.map
