
const pepjs = require('pepjs'); // eslint-disable-line no-unused-vars
const mat4 = require('gl-matrix').mat4;
const defaults = require('defaults');

module.exports = function Trackball(element, opts = {}) {

  opts = defaults(opts, {
    speed: 0.005,
    onRotate: function(){},
    drag: 0.0,
    invert: false,
    hideCursor: false,
  });

  const invert = opts.invert ? -1 : 1;
  const rotation = mat4.create();
  let disposed = false;
  let oldElementCursorStyle = element.style.cursor;

  const pointer = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    down: false,
  };

  function rotate(dx, dy) {
    const rot = mat4.create();
    mat4.rotateY(rot, rot, dx * opts.speed);
    mat4.rotateX(rot, rot, dy * opts.speed);
    mat4.multiply(rotation, rot, rotation);
    opts.onRotate();
  }

  function spin(dx, dy) {
    pointer.dx = dx;
    pointer.dy = dy;
  }

  function update() {
    if (disposed) return;
    requestAnimationFrame(update);
    if (pointer.down) {
      pointer.dx = 0;
      pointer.dy = 0;
    }
    if (Math.abs(pointer.dx * opts.speed) < 0.0001 && Math.abs(pointer.dy * opts.speed) < 0.0001) {
      pointer.dx = 0;
      pointer.dy = 0;
    }
    if (pointer.dx === 0 && pointer.dy === 0) {
      return;
    }
    pointer.dx -= pointer.dx * opts.drag;
    pointer.dy -= pointer.dy * opts.drag;
    rotate(pointer.dx, pointer.dy);
  }

  update();

  function onPointerDown(e) {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.dx = 0;
    pointer.dy = 0;
    pointer.down = true;
    element.setPointerCapture(e.pointerId);
    if (opts.hideCursor) {
      oldElementCursorStyle = element.style.cursor;
      element.style.cursor = 'none';
    }
    e.preventDefault();
  }

  function onPointerUp() {
    pointer.down = false;
    element.style.cursor = oldElementCursorStyle;
  }

  function onPointerMove(e) {
    if (!pointer.down) return;
    pointer.dx = invert * (e.clientX - pointer.x);
    pointer.dy = invert * (e.clientY - pointer.y);
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    rotate(pointer.dx, pointer.dy);
  }

  function onPointerCancel(e) {
    element.releasePointerCapture(e.pointerId);
  }

  element.addEventListener('pointerdown', onPointerDown);
  element.addEventListener('pointerup', onPointerUp);
  element.addEventListener('pointermove', onPointerMove);
  element.addEventListener('pointercancel', onPointerCancel);

  function dispose() {
    element.removeEventListener('pointerdown', onPointerDown);
    element.removeEventListener('pointerup', onPointerUp);
    element.removeEventListener('pointermove', onPointerMove);
    element.removeEventListener('pointercancel', onPointerCancel);
    disposed = true;
  }

  return {
    spin: spin,
    rotation: rotation,
    dispose: dispose,
  };

};
