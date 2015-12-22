'use strict';
var Geometry    = require('gl-geometry');
var glShader    = require('gl-shader');
var mat4        = require('gl-mat4');
var normals     = require('normals');
var glslify     = require('glslify');
var bunny       = require('bunny');
var boundingBox = require('vertices-bounding-box');
var Trackball   = require('../index.js');

window.onload = function() {

    var canvas = document.getElementById('render-canvas');
    var gl = canvas.getContext('webgl');
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    var bb = boundingBox(bunny.positions);
    var shift = [
        0.5 * (bb[0][0] + bb[1][0]),
        0.5 * (bb[0][1] + bb[1][1]),
        0.5 * (bb[0][2] + bb[1][2]),
    ];
    for (var i = 0; i < bunny.positions.length; i++) {
        bunny.positions[i][0] -= shift[0];
        bunny.positions[i][1] -= shift[1];
        bunny.positions[i][2] -= shift[2];
    }

    var geometry = Geometry(gl);
    geometry.attr('aPosition', bunny.positions);
    geometry.attr('aNormal', normals.vertexNormals(bunny.cells, bunny.positions));
    geometry.faces(bunny.cells);

    var program = glShader(gl, glslify('./glsl/bunny.vert'), glslify('./glsl/bunny.frag'));

    var projection = mat4.create();
    var view = mat4.create();

    var trackball = new Trackball(canvas, {
        onRotate: render,
        drag: 0.01
    });

    trackball.spin(13,0);

    function render() {
        var width = canvas.clientWidth;
        var height = canvas.clientHeight;
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
        mat4.perspective(projection, Math.PI/2, width/height, 0.01, 100);
        mat4.lookAt(view, [0, 0, 12], [0, 0, 0], [0, 1, 0]);
        geometry.bind(program);
        program.uniforms.uProjection = projection;
        program.uniforms.uView = view;
        program.uniforms.uModel = trackball.rotation;
        geometry.draw(gl.TRIANGLES)
    }

    render();
}
