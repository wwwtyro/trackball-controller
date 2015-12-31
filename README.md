# trackball-controller

Captures mouse events on an element and translates them to trackball-like motion.

[demo](http://wwwtyro.github.io/trackball-controller/example/)

## Example

```js
var Trackball = require('trackball-controller');

var trackball = new Trackball(canvasElement, {
    // Call the render function when a rotation event occurs.
    onRotate: render,
    // Decrease the momentum by 1% each iteration of the internal trackball
    // loop.
    drag: 0.01
});

// Simulate the user spinning the trackball 13 pixels to the right.
trackball.spin(13,0);

function render() {
    // Set the model transform to the rotation of the trackball.
    program.uniforms.uModel = trackball.rotation;
    geometry.draw(gl.TRIANGLES);
}
```

## Usage

### Install
```sh
npm install trackball-controller
```

### API
```js
var trackball = new Trackball(targetElement, {opts})
```

Creates a new `Trackball` object and kicks off a 60FPS internal loop to update the
momentum of the trackball. Listens to `mousedown` events on the `targetElement`
DOM element.

#### Options

```js
{
    speed: 0.005,
    container: window,
    onRotate: function() {},
    drag: 0.0,
    invert: false
}
```

* `speed` is how many radians are rotated per pixel the mouse is dragged.
  Defaults to `0.005` radians/pixel.
* `container` is the element that will listen to `mouseup` and `mousemove` events.
  This allows the user to interact with the trackball even outside of the bounds
  of the `targetElement`. Defaults to `window`, which will maximize the
  interactive region.
* `onRotate` is a callback function triggered whenever the trackball rotates,
  either through user interaction via the mouse or during momentum-compelled
  motion. Defaults to an empty function. Defaults to `noop` function.
* `drag` is what fraction of the trackball's momentum is lost during internal
  loop iterations. Set to `0.0` to make the trackball spin forever,
  `1.0` to make it spin not at all outside of mouse interaction, or somewhere
  in between to make the spin gradually degrade to zero. Defaults to `0.0`.
* `invert` declares whether or not to invert the motion of the trackball. Useful
  for rotating objects around the viewer, such as a skybox. Defaults to `false`.
