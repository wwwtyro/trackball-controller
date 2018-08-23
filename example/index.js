'use strict';

const bunny = require('bunny');
const center = require('geo-center');
const mat4 = require('gl-matrix').mat4;
const normals = require('normals');
const REGL = require('regl');

const Trackball = require('../index.js');

const canvas = document.getElementById('render-canvas');

const regl = REGL({
  canvas: canvas,
});

canvas.style.cursor = 'crosshair';

const trackball = Trackball(canvas, {
  onRotate: render,
  drag: 0.01,
  hideCursor: true,
});

trackball.spin(13,0);

bunny.positions = center(bunny.positions);
bunny.normals = normals.vertexNormals(bunny.cells, bunny.positions);

const cmdRender = regl({
  vert: `
    precision highp float;
    uniform mat4 model, view, projection;
    attribute vec3 position, normal;
    varying vec3 vNormal;
    void main() {
      gl_Position = projection * view * model * vec4(position, 1);
      vNormal = normal;
    }`,
  frag: `
    precision highp float;
    varying vec3 vNormal;
    void main() {
      gl_FragColor = vec4(0.5 * vNormal + 0.5,1);
    }`,
  attributes: {
    position: bunny.positions,
    normal: bunny.normals,
  },
  uniforms: {
    model: regl.prop('model'),
    view: regl.prop('view'),
    projection: regl.prop('projection'),
  },
  viewport: regl.prop('viewport'),
  elements: bunny.cells,
});

function render() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  regl.clear({
    color: [0, 0, 0, 0],
    depth: 1,
  });

  const view = mat4.lookAt([], [0,0,24], [0,0,0], [0,1,0]);
  const projection = mat4.perspective([], Math.PI/4, canvas.width/canvas.height, 0.1, 1000);

  cmdRender({
    model: trackball.rotation,
    view: view,
    projection: projection,
    viewport: {x: 0, y: 0, width: canvas.width, height: canvas.height},
  });
}

window.addEventListener('resize', render);

requestAnimationFrame(render);
