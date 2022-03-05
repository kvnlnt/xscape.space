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
  var useMachine = (context, machine2) => {
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
    const pub = (message) => {
      _context = machine2(message, _context);
      _subs.filter((sub2) => sub2["action"] === message["action"]).forEach((i) => i.cb(_context));
      return _context;
    };
    return {
      get,
      pub,
      sub
    };
  };

  // src/app/pages/DesignSystem.ts
  var machine = useMachine({todo: "test", state: "IDLE"}, (message, context) => {
    switch (context.state) {
      case "IDLE":
        switch (message.action) {
          case "TODO_UPDATE":
            context = {...context, todo: message.payload.todo};
            break;
          case "SUBMIT":
            console.log(context);
            break;
        }
    }
    return context;
  });
  var DesignSystem = () => {
    const listenForContextChange = (el) => machine.sub("TODO_UPDATE", (context) => {
      el.innerText = context.todo;
      return null;
    });
    const handleInput = (el) => machine.pub({action: "TODO_UPDATE", payload: {todo: el.value}});
    const template = html("div")(html("h1", ["color", "blue"])("ExampleApp"), html("h2", ["style", "fontSize", "24px"])("subtitle"), html("div", ["style", "fontSize", "18px"], ["bind", listenForContextChange])("..."), html("form", ["onsubmit", () => machine.pub({action: "SUBMIT"})])(html("fieldset")(html("legend")("to dos"), html("input", ["attr", "name", "input"], ["oninput", handleInput])(), html("button", ["attr", "type", "submit"])("Submit"))));
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
