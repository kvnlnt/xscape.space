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
  var useModel = (model) => {
    const _model = model;
    const _subscriptions = [];
    const subscriber = (key, cb) => {
      _subscriptions.push({
        key,
        cb
      });
    };
    const getter = (key) => {
      return _model[key];
    };
    const setter = (key, val) => {
      _model[key] = val;
      _subscriptions.filter((i) => i.key === key).forEach((i) => i.cb(_model[key]));
      return _model[key];
    };
    return {
      get: getter,
      set: setter,
      sub: subscriber
    };
  };

  // src/app/pages/DesignSystem.ts
  var DesignSystem = () => {
    let state = "IDLE";
    const todoModel = useModel({Todo: "test"});
    const handleOnInput = (el) => machine({action: "TODO_UPDATE", todo: el.value});
    const handleSubmit = (evt) => console.log(evt.target, todoModel.get("Todo"));
    const listenForTodoChange = (el) => todoModel.sub("Todo", (todo) => {
      el.innerText = todo;
    });
    const machine = (message) => {
      switch (state) {
        case "IDLE":
          switch (message.action) {
            case "TODO_UPDATE":
              todoModel.set("Todo", message.todo);
              break;
          }
      }
    };
    return html("div")(html("h1", ["color", "blue"])("ExampleApp"), html("h2", ["style", "fontSize", "24px"])("subtitle"), html("div", ["style", "fontSize", "18px"], ["bind", listenForTodoChange])("..."), html("form", ["onsubmit", handleSubmit])(html("fieldset")(html("legend")("to dos"), html("input", ["attr", "name", "input"], ["oninput", handleOnInput])(), html("button", ["attr", "type", "submit"])("Submit"))));
  };

  // src/main.ts
  window.addEventListener("DOMContentLoaded", async () => {
    const resetStyle = `margin:0px;padding:0px;width:100vw;height:100vh;`;
    const [body] = useDom("body", ["style", resetStyle]);
    body(DesignSystem());
  });
})();
//# sourceMappingURL=app.js.map
