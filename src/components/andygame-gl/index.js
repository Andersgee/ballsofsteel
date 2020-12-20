import webgl from "./webgl";
import { setcanvassize, debounce, mousexy } from "./utils";

export default class Andygame {
  constructor(canvas, glslcommon, glsl, texturefilenames) {
    this.canvas = canvas;
    this.gl = webgl.context(this.canvas);
    this.layout = webgl.shaderlayout();

    this.uniforms = webgl.shaderuniforms();
    this.shader = webgl.shaderprogram(this.gl, this.layout, glslcommon, glsl);
    this.gl.useProgram(this.shader);
    webgl.bindquad(this.gl, this.shader);
    webgl.bindtextures(this.gl, texturefilenames);

    setcanvassize(this.gl, this.canvas, this.uniforms);

    window.addEventListener("resize", this.resizehandler);
    this.canvas.addEventListener("mousemove", this.handlemousemove);

    this.animframe = requestAnimationFrame(this.animate);
  }

  updategamestate(gamestate) {
    for (let id in gamestate) {
      let i = gamestate[id].i;
      let p = gamestate[id].p;
      this.uniforms.playerpos[i * 4 + 0] = p[0];
      this.uniforms.playerpos[i * 4 + 1] = p[1];
      this.uniforms.playerpos[i * 4 + 2] = p[2];
    }
  }

  resizehandler = debounce(() => this.handlesizing(), 100);

  handlesizing() {
    setcanvassize(this.gl, this.canvas, this.uniforms);
  }

  handlemousemove = (e) => {
    this.uniforms.mouse = mousexy(this.canvas, e);
  };

  animate = (timestamp) => {
    webgl.draw(this.gl, this.shader, this.uniforms);
    this.animframe = requestAnimationFrame(this.animate);
  };
}
