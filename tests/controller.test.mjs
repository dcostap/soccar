import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const code = await readFile("src/game.js", "utf8");
const inputCode = code.slice(
  code.indexOf("var Ot = {"),
  code.indexOf("var It = "),
);
const menuCode = code.slice(
  code.indexOf("var _b = class"),
  code.indexOf("function vb()"),
);
const frameCode = code.slice(code.indexOf("function Rx(e) {"));
const pollCode = frameCode.slice(
  frameCode.indexOf("Px = e;") + "Px = e;".length,
  frameCode.indexOf("  (sb("),
);

function setup() {
  const buttons = Array.from({ length: 18 }, () => ({
    pressed: false,
    value: 0,
  }));
  const pad = {
    connected: true,
    mapping: "standard",
    id: "Test controller",
    buttons,
    axes: [0, 0, 0, 0],
  };
  const events = new Map();
  const context = vm.createContext({
    navigator: { getGamepads: () => [pad] },
    window: {
      addEventListener: (name, callback) => events.set(name, callback),
    },
    HTMLInputElement: class {},
    at: () => ({}),
  });
  vm.runInContext(
    `${inputCode}\n${menuCode}\nwx = new Nt(jt); menu = Object.create(_b.prototype); menu.stack = [{ items: [] }]; menu.capturing = null;`,
    context,
  );
  const poll = vm.runInContext(
    `(function () { const t = 1 / 60; ${pollCode}\nreturn { input: n, button: r }; })`,
    context,
  );
  return {
    events,
    menu: context.menu,
    bindings: context.wx.settings.padBindings,
    press(index, value = 1) {
      buttons[index] = { pressed: value === 1, value };
    },
    release(index) {
      buttons[index] = { pressed: false, value: 0 };
    },
    frame() {
      const result = poll();
      context.menu.handleInput(
        result.input,
        context.menu.capturing ? result.button : null,
      );
      return result;
    },
  };
}

test("controller remapping ignores held confirm and captures the next press", () => {
  const game = setup();
  // Use the actual frame polling order and the actual menu capture handler.
  game.press(0);
  assert.equal(game.frame().input.nav.confirm, true);
  const assigned = [];
  game.menu.capturing = (button) => assigned.push(button);
  game.frame();
  assert.deepEqual(assigned, []);
  game.release(0);
  game.frame();
  // The controller Back button must be assignable, not cancel the capture.
  game.press(1);
  game.frame();
  assert.deepEqual(assigned, [1]);
  assert.equal(game.menu.capturing, null);
  assert.equal(game.frame().button, null);
});

test("default controller bindings match the selected layout", () => {
  const game = setup();
  assert.deepEqual(
    { ...game.bindings },
    {
      throttle: 7,
      reverse: 6,
      jump: 0,
      boost: 2,
      powerslide: 5,
      airRoll: 6,
      airRollLeft: 5,
      airRollRight: 4,
      ballCam: 4,
      rearView: 11,
      scoreboard: 10,
      pause: 9,
      reset: 8,
    },
  );
});

test("controller remapping captures analog trigger presses", () => {
  const game = setup();
  game.frame();
  let assigned;
  game.menu.capturing = (button) => {
    assigned = button;
  };
  game.press(7, 0.75);
  game.frame();
  assert.equal(assigned, 7);
});

test("Escape cancels controller remapping without changing the binding", () => {
  const game = setup();
  let assigned = "waiting";
  game.menu.capturing = (button) => {
    assigned = button;
  };
  game.events.get("keydown")({ code: "Escape" });
  game.frame();
  assert.equal(assigned, null);
  assert.equal(game.menu.capturing, null);
});
