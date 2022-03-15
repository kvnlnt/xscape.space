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

  // src/app/lib/Feds.ts
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
    const $ = Html({
      color: (el, color) => el.style.color = Color(color),
      font_size: (el, size) => el.style.fontSize = `${size}px`,
      on_input: (el) => {
        el.addEventListener("input", () => {
          machine.pub({action: "TODO_UPDATE", payload: {todo: el.value}});
        });
      },
      on_submit: (el) => {
        el.addEventListener("click", (e) => {
          e.preventDefault();
          machine.pub({action: "SUBMIT"});
        });
      },
      on_machine_message: (el, msg) => machine.sub(msg, (context) => {
        if (msg === "TODO_UPDATE")
          el.innerText = context.todo;
        return null;
      })
    });
    const template = $("div")($("h1", ["color", "blue"])("ExampleApp"), $("h2", ["font_size", 24])("subtitle"), $("div", ["font_size", 18], ["on_machine_message", "TODO_UPDATE"])("..."), $("form")($("fieldset")($("legend")("to dos"), $("input", ["on_input"])(), $("button", ["on_submit"])("Submit"))));
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
