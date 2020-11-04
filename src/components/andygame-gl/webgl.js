function shaderlayout() {
  return {
    attributes: {
      clipspace: 2,
    },
    uniforms: {
      playerid: "uniform1i",
      metaltex: "uniform1i",
      metaltexspec: "uniform1i",
      metaltexnormal: "uniform1i",
      time: "uniform1f",
      Nplayers: "uniform1i",
      playerpos: "uniform4fv",
      playercol: "uniform3fv",
      canvassize: "uniform2fv",
      mouse: "uniform2fv",
    },
  };
}

function shaderuniforms() {
  return {
    playerid: 0,
    metaltex: 0,
    metaltexspec: 1,
    metaltexnormal: 2,
    time: 0.0,
    Nplayers: 4,
    //playerpos: new Float32Array(2 * 10),
    playerpos: new Float32Array([
      0,
      1.5,
      0,
      1.5,
      2,
      0.5,
      0,
      0.5,
      0,
      0.5,
      2,
      0.5,
    ]),
    playercol: new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
    canvassize: [1, 1],
    mouse: [0.5, 0.5],
  };
}

function context(canvas) {
  let gl = canvas.getContext("webgl2");
  gl || alert("You need a browser with webgl2. Try Firefox or Chrome.");
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0, 0, 0, 1);
  return gl;
}

function draw(gl, program, uniforms) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  setuniforms(gl, program, uniforms);
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);
}

function bindquad(gl, program) {
  const index = new Uint32Array([0, 1, 2, 2, 3, 0]);
  const clipspace = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]);
  gl.bindVertexArray(gl.createVertexArray());
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, index, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(program.attributes.clipspace.loc);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.vertexAttribPointer(
    program.attributes.clipspace.loc,
    program.attributes.clipspace.sz,
    gl.FLOAT,
    false,
    0,
    0
  );
  gl.bufferData(gl.ARRAY_BUFFER, clipspace, gl.STATIC_DRAW);
}

function setuniforms(gl, program, uniforms) {
  for (let name in program.uniforms) {
    gl[program.uniforms[name].func](program.uniforms[name].loc, uniforms[name]);
  }
}

//PROGRAM
function shaderprogram(gl, layout, common, text) {
  let verttext = common.concat("\n#define VERT;\n", text);
  let fragtext = common.concat("\n#define FRAG;\n", text);

  let vert = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vert, verttext);
  gl.compileShader(vert);

  let frag = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(frag, fragtext);
  gl.compileShader(frag);

  let program = gl.createProgram();
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);

  program.attributes = getattributes(gl, program, layout.attributes);
  program.uniforms = getuniforms(gl, program, layout.uniforms);
  console.log("program: ", program);

  return program;
}

function getattributes(gl, program, layout) {
  let attributes = {};
  for (let name in layout) {
    let loc = gl.getAttribLocation(program, name);
    if (loc !== -1) {
      attributes[name] = { loc: loc, sz: layout[name] };
    }
  }
  return attributes;
}

function getuniforms(gl, program, layout) {
  let uniforms = {};
  for (let name in layout) {
    let loc = gl.getUniformLocation(program, name);
    if (loc !== null) {
      uniforms[name] = { loc: loc, func: layout[name] };
    }
  }
  return uniforms;
}

//Textures
function teximage2d_rgba(gl, image) {
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
}

function teximage2d_rgbafromdata(gl, width, height, data) {
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    width,
    height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    data
  );
}

function bindtexture(gl, filenames, i) {
  let image = new Image();
  image.src = filenames[i];

  gl.activeTexture(gl.TEXTURE0 + i);
  let tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  teximage2d_rgbafromdata(gl, 1, 1, new Uint8Array([0, 0, 0, 255]));

  image.onload = () => {
    gl.activeTexture(gl.TEXTURE0 + i);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    teximage2d_rgba(gl, image);
    console.log("bound: ", filenames[i]);
  };
}

function bindtextures(gl, filenames) {
  for (let i = 0; i < filenames.length; i++) {
    bindtexture(gl, filenames, i);
  }
}

export default {
  bindtextures,
  shaderlayout,
  shaderuniforms,
  context,
  bindquad,
  shaderprogram,
  draw,
};
